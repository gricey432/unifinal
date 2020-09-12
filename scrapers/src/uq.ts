import cheerio from "cheerio";
import isNumber from "is-number";
import {AssessmentItem, Offering, Scraper} from "./types";
import axios from "./axios";


const scraper: Scraper = {
    async getCourseCodes(year: number, semester: number): Promise<Array<string>> {
        const url = `https://my.uq.edu.au/programs-courses/search.html?searchType=course&keywords=&CourseParameters%5Bsemester%5D=${year}:${semester}`;
        const pageResp = await axios.get(url);
        const $page = cheerio.load(pageResp.data);
        return $page(".listing a.code").toArray().map((a) => cheerio(a).text().trim());
    },
    async getOffering(year: number, semester: number, courseCode: string): Promise<Offering> {
        async function getCourseProfileUrl(): Promise<string> {
            // Will look like https://course-profiles.uq.edu.au/student_section_loader/section_1/104133
            const coursePageResp = await axios.get(`https://my.uq.edu.au/programs-courses/course.html?course_code=${courseCode}`);
            const $coursePage = cheerio.load(coursePageResp.data);
            for (const tr of $coursePage(".offerings > tbody > tr").toArray()) {
                // Cols: Course offerings, Location Mode, Course Profile
                const tds = cheerio(tr).children("td").toArray();
                if (cheerio(tds[0]).text().trim() === `Semester ${semester}, ${year}`) {
                    const url = cheerio(tds[3]).find('a').first().attr("href");
                    if (url) {
                        return url;
                    }
                }
            }
            throw "Didn't find offering";
        }
        const courseProfileUrl = await getCourseProfileUrl();
        const assessmentUrl = courseProfileUrl.replace("section_1", "section_5");
        const courseProfilePage = await axios.get(assessmentUrl);
        const $courseProfilePage = cheerio.load(courseProfilePage.data);
        const assessmentItems: Array<AssessmentItem> = $courseProfilePage('h3:contains("5.1 Assessment Summary")')
            .siblings('table')
            .first()
            .find('tbody > tr')
            .toArray()
            .map((tr) => {
                // Cols: Assessment Task, Due Date, Weighting, Learning Objectives
                const tds = cheerio(tr).children("td").toArray();
                const name = cheerio(tds[0]).text().trim().split("\n").pop()!.trim();
                let weight: string | number = cheerio(tds[2]).text().trim();
                if (weight.endsWith("%")) {
                    // Possibly a percent we can process
                    if (isNumber(weight.slice(0, -1))) {
                        weight = Number(weight.slice(0, -1));
                    }
                }
                return {
                    name,
                    weight,
                }
            });
        debugger;
        return {
            assessment: assessmentItems,
        };
    }
}

export default scraper;
