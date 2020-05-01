export type Config = {
    name: string;
    url: string;
    pageTitle: string;
    facebookAppId: string;
    ogImage: string;
    ogDescription: string;
    metaDescription: string;
    appName: string;
    googleAnalyticsId: string;
    placeholderCourseCode: string;
    disclaimer: string;
    bgColour: string;
    headerHeight: string;
    chartColour: string;
    themeColour: string;
    semesters: Array<{  // Oldest to newest
        id: string;
        name: string;
    }>;
    defaultCutoffs: Array<number>;  // Default cutoffs out of 100 for grades 0 and up
}
