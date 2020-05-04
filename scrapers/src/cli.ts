#!/usr/bin/env node
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
type apiArgv = {
    institution: string,
    year: number,
    semester: number,
    courseCode: string,
};

const argv = Yargs.scriptName("unifinal-scraper")
    .usage("$0 <cmd> [args]")
    .command<apiArgv>("scrape <institution> <year> <semester> <courseCode>", "Scrape a given offering", (yargs: Argv) => {
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