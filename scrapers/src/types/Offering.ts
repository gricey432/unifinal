export type AssessmentItem = {
    name: string,
    weight: string | number,
}

export type Offering = {
    message?: string,
    cutoffs?: Array<number>,
    assessment: Array<AssessmentItem>,
}
