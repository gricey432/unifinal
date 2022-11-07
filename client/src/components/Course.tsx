import * as React from "react";
import {useState} from "react";
import {Map, List} from "immutable";

import {Messages} from "./Messages";
import {AssessmentItemData} from "../api";
import {AssessmentItem} from "./AssessmentItem";
import {NonNumericWeightAssessmentItem} from "./NonNumericWeightAssessmentItem";
import {CircleProgressBar} from "./CircleProgressBar";
import {DetailTableRow} from "./DetailTableRow";


function notEmpty<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}


type Props = {
    code: string;
    message: string | null;
    cutoffs: List<number>;
    assessmentItems: List<AssessmentItemData>;
}

type NumericAssessmentItem = AssessmentItemData & {
    weight: number;
    isNumericWeighting: true;
    score: number | null;
}
type NonNumericAssessmentItem = AssessmentItemData & {
    isNumericWeighting: false;
}
type AnyAssessmentItem = NumericAssessmentItem | NonNumericAssessmentItem;
function isNumericAssessmentItem(item: AnyAssessmentItem): item is NumericAssessmentItem {
    return item.isNumericWeighting;
}


export const Course: React.FunctionComponent<Props> = (props) => {
    const [moreDetail, setMoreDetail] = useState<boolean>(false);
    const [scores, setScores] = useState<Map<number, number | null>>(Map()); // Assessment item id: score
    const [selectedTargetGrade, setSelectedTargetGrade] = useState<string>("4");

    const assessmentItems: List<NumericAssessmentItem | NonNumericAssessmentItem> = props.assessmentItems.map((ai, i) => {
        const isNumericWeighting = /^[\d\.]+$/.test(ai.weight.toString()) && ai.weight !== "0" && ai.weight !== 0;
        if (!isNumericWeighting) {
            return {
                ...ai,
                isNumericWeighting: false,
            };
        }
        return {
            ...ai,
            weight: Number(ai.weight),
            isNumericWeighting: true,
            score: scores.get(i, null),
        };
    });

    const numericAssessmentItems: List<NumericAssessmentItem> = assessmentItems.filter(isNumericAssessmentItem);

    const totalScore = numericAssessmentItems
        .map((item) => item.score == null ? null : item.weight * item.score)
        .filter(notEmpty)
        .reduce((a, b) => a + b, 0);

    const totalDropped = numericAssessmentItems
        .map((item) => item.score === null ? null : (1 - item.score) * item.weight)
        .filter(notEmpty)
        .reduce((a, b) => a + b, 0);

    const totalWeight = numericAssessmentItems
        .map((item) => item.weight)
        .reduce((a, b) => a + b, 0);

    const providedTotalWeight = numericAssessmentItems
        .filter((ai) => notEmpty(ai.score))
        .map((item) => item.weight)
        .reduce((a, b) => a + b, 0);

    const unprovidedTotalWeight = numericAssessmentItems
        .filter((item) => item.score === null)
        .map((item) => item.weight)
        .reduce((a, b) => a + b, 0);

    const requiredGrades = props.cutoffs.map((cutoff) => {
        const requiredGrade = Math.ceil( (cutoff - totalScore) / unprovidedTotalWeight * 100);
        return Math.max(0, requiredGrade);
    });

    function clickShowMoreDetail() {
        setMoreDetail(true);
    }

    return (
        <>
            {totalWeight > 100 && <Messages messages={["Assessment items add up to more than 100% and may not calculate correctly"]}/>}

            <div className="assessment">
                <table>
                    <thead>
                    <tr>
                        <th>Assessment</th>
                        <th>Weight</th>
                        <th className="scoreColumn text-right">Score</th>
                        <th className="assessmentGraphColumn hidden-xs"/>
                    </tr>
                    </thead>
                    <tbody>
                        {assessmentItems.map((ai, i) => isNumericAssessmentItem(ai) ? <AssessmentItem
                            {...ai}
                            setScore={(score) => setScores((oldScores) => oldScores.set(i, score))}
                            key={i}
                        /> : <NonNumericWeightAssessmentItem {...ai} key={i} />)}
                    </tbody>
                </table>
            </div>
    
            <div className="results">
                <div className="resultsGraphContainer">
                    <CircleProgressBar value={totalScore / 100} strokeWidth={10} trailWidth={5} />
                </div>
                <div>
                    <div className="title">Results</div>
                    <p>Total Score: {totalScore.toFixed(2)}%</p>
                    <p>Total Dropped: {totalDropped.toFixed(2)}%</p>
                </div>
                <div className="clearfix"/>
                {moreDetail ? (
                    <table className="detailTable">
                        <thead>
                            <tr>
                                <th>Grade</th>
                                <th className="text-right">Cutoff</th>
                                <th className="text-right">Required %</th>
                                <th className="text-right">Required Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.cutoffs.map((v, k) => (
                                <DetailTableRow
                                    key={k}
                                    grade={(k + 1).toString()}
                                    cutoff={v}
                                    totalScore={totalScore}
                                    unprovidedTotalWeight={unprovidedTotalWeight}
                                />
                            )).toArray()}
                        </tbody>
                    </table>
                ) : (
                    <>
                        <div className="resultsSentence">
                            To get a <select title="Target Grade" value={selectedTargetGrade} onChange={(e) => setSelectedTargetGrade(e.target.value)}>{
                                requiredGrades.keySeq().map((k) => {
                                    // Grades are 1 indexed, but all our arrays are 0 indexed
                                    const grade = k + 1;
                                    return <option key={grade} value={grade}>{grade}</option>;
                                }).toArray()
                            }</select>, you need {requiredGrades.get(Number(selectedTargetGrade) - 1)}%
                        </div>
                        <div className="fake-link text-center" onClick={clickShowMoreDetail}>more details&hellip;</div>
                    </>
                )}
            </div>
        </>
    )
};
