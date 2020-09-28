/**
 * Data sync using md5 hashing and S3 ETags
 */
import hasha from "hasha";
import dir from "node-dir";
import {promises as fs} from "fs";
import {S3Client} from '@aws-sdk/client-s3-node/S3Client';
import {ListObjectsV2Command, ListObjectsV2Output} from "@aws-sdk/client-s3-node";
import {PutObjectCommand} from '@aws-sdk/client-s3-node/commands/PutObjectCommand';

const institution: string = process.argv[2];
if (!institution) {
    throw "Run with one positional arg: institution";
}

const s3 = new S3Client({});
const s3Prefix = "data/";
const s3Bucket = `unifinal-${institution}`;
const filePrefix = `../${institution}/`;

async function getS3FileHashes(): Promise<Map<string, string>> {
    const result: Map<string, string> = new Map();
    let continuationToken: undefined | string = undefined;
    do {
        const resp: ListObjectsV2Output = await s3.send(new ListObjectsV2Command({
            Bucket: s3Bucket,
            Prefix: s3Prefix,
            ContinuationToken: continuationToken,
            MaxKeys: 1000,  // 1000 is max
        }));
        continuationToken = resp.NextContinuationToken;
        resp.Contents!.forEach((file) => {
            result.set(file.Key!.slice(s3Prefix.length), file.ETag!.replace(/"/g, ""));  // Etag values
        });
    } while (continuationToken);
    return result;
}

async function getLocalFileHashes(): Promise<Map<string, string>> {
    const result: Map<string, string> = new Map();
    const files = (await dir.promiseFiles(filePrefix))
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.slice(filePrefix.length));
    for await (const f of files) {
        const hash = await hasha.fromFile(filePrefix + f, {algorithm: "md5"});
        result.set(f.replace("\\", "/"), hash);
    }
    return result;
}

async function run(): Promise<void> {
    console.log("Starting syncer");
    // Get the hashes of each file locally and on S3
    const [s3Map, localMap] = await Promise.all([getS3FileHashes(), getLocalFileHashes()]);
    console.log(`${localMap.size} local files`);
    console.log(`${s3Map.size} s3 files`);

    // Upload files which don't match or don't exist remotely
    for (const [key, localHash] of localMap.entries()) {
        const s3Hash = s3Map.get(key);
        if (s3Hash == undefined || localHash !== s3Hash) {
            console.log(`Uploading ${key}`);
            const body = await fs.readFile(filePrefix + key);
            await s3.send(new PutObjectCommand({
                Body: body,
                Bucket: s3Bucket,
                ContentType: "application/json",
                Key: "data/" + key,
            }));
        }
    }
}

run()
