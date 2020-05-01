import {Config} from "./types";

export const qut: Config = {
    name: "qut",
    url: "https://qut.grade.tools",
    pageTitle: "QUT Final Exam Calculator",
    facebookAppId: "235985883840013",
    ogImage: "https://qut.grade.tools/img/og.png",
    ogDescription: "Easily calculate the required marks for your final exams at the Queensland University of Technology",
    metaDescription: "Want to know what you need on your final exam? Easily calculate the required marks for your exams at the Queensland University of Technology with this calculator.",
    appName: "QUT Grade Tools",
    googleAnalyticsId: "UA-119545525-1",
    placeholderCourseCode: "EGB111",
    disclaimer: "Not affiliated with QUT. Always check the official course information.",
    bgColour: "#00467f",
    headerHeight: "148px",
    chartColour: "#00467f",
    themeColour: "#00467f",
    semesters: [
        {id: "2018-1", name: "Semester 1, 2018"},
        {id: "2018-2", name: "Semester 2, 2018"},
        {id: "2019-1", name: "Semester 1, 2019"},
    ],
    defaultCutoffs: [0, 30, 45, 50, 65, 75, 85],
};
