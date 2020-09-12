#!/usr/bin/env node
import fs from "fs";
import {Offering, Scraper} from "./types";
import UQScraper from "./uq";
import Yargs, {Argv} from 'yargs'

const scrapers: Map<string, Scraper> = new Map([
    ["uq", UQScraper],
]);

function offeringToString(offering: Offering): string {
    // Ensures the files are all written the same way
    return JSON.stringify(offering, undefined, "\t");
}


// CLI
type getCourseCodesArgv = {
    institution: string,
    year: number,
    semester: number,
};
type scrapeAllArgv = {
    institution: string,
    year: number,
    semester: number,
};
type scrapeIndividualArgv = {
    institution: string,
    year: number,
    semester: number,
    courseCode: string,
};

const argv = Yargs.scriptName("unifinal-scraper")
    .usage("$0 <cmd> [args]")
    .command<getCourseCodesArgv>("courses <institution> <year> <semester>", "Get all course codes", (yargs: Argv) => {
        yargs
            .positional("institution", {
                type: "string",
            })
            .positional("year", {
                type: "number",
            })
            .positional("semester", {
                type: "number",
            })
    }, async (argv) => {
        const result = await scrapers.get(argv.institution)!.getCourseCodes(argv.year, argv.semester);
        console.log(result);
    })
    .command<getCourseCodesArgv>("scrape-all <institution> <year> <semester>", "Scrape all offerings", (yargs: Argv) => {
        yargs
            .positional("institution", {
                type: "string",
            })
            .positional("year", {
                type: "number",
            })
            .positional("semester", {
                type: "number",
            })
    }, async (argv) => {
        const scraper = scrapers.get(argv.institution)!;
        const courseCodes = await scraper.getCourseCodes(argv.year, argv.semester);
        if (!fs.existsSync("out")){
            fs.mkdirSync("out");
        }
        for (const courseCode of courseCodes) {
            const filename = `out/${courseCode}.json`;
            if (fs.existsSync(filename)) {
                console.log(`${courseCode} - Skipped, already exists`);
            } else {
                console.log(courseCode);
                try {
                    const result = await scraper.getOffering(argv.year, argv.semester, courseCode);
                    fs.writeFileSync(filename, offeringToString(result));
                } catch (e) {
                    console.warn(`${courseCode} failed: ${e.toString()}`);
                }
            }
        }
    })
    .command<scrapeIndividualArgv>("scrape <institution> <year> <semester> <courseCode>", "Scrape a given offering", (yargs: Argv) => {
        yargs
            .positional("institution", {
                type: "string",
            })
            .positional("year", {
                type: "number",
            })
            .positional("semester", {
                type: "number",
            })
            .positional("courseCode", {
                type: "string",
            });
    }, async (argv) => {
        const result = await scrapers.get(argv.institution)!.getOffering(argv.year, argv.semester, argv.courseCode);
        console.log(offeringToString(result));
    })
    .help()
    .argv;
console.log(argv);