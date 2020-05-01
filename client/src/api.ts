export type AssessmentItemData = {
    name: string,
    weight: string | number,
}

export type OfferingData = {
    message?: string,
    cutoffs?: Array<number>,
    assessment: Array<AssessmentItemData>,
}
