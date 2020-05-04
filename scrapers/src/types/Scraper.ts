import {Offering} from ".";


export interface Scraper {
    getCourseCodes: (year: number, semester: number) => Promise<Array<string>>;
    getOffering: (year: number, semester: number, courseCode: string) => Promise<Offering>;
}
