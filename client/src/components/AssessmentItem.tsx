import * as React from "react";
import {useEffect, useState} from "react";
const isNumber = require("is-number");
import classNames from "classnames";

import {CircleProgressBar} from "./CircleProgressBar";
import {ScoreInput} from "./ScoreInput";


type Props = {
    name: string;
    weight: number;
    setScore: (newScore: number | null) => void;
}


/*
 * This component is a little non-reacty since it doesn't take score from the parent.
 * We have the benefit that we always want it to start empty
 * But passing all the raw scores to the parent and having it process them all is just a mess
 */
export const AssessmentItem: React.FunctionComponent<Props> = (props) => {
    const [rawScore, setRawScore] = useState<string>("");

    const score: number | null = (() => {
        if (rawScore === '' || rawScore == null) {
            return null;
        } else {
            try {
                if (isNumber(rawScore) && parseFloat(rawScore)) {
                    return parseFloat(rawScore) / 100;
                }
                return eval(rawScore.replace("%", "/100"));
            } catch (e) {
                return null;
            }
        }
    })();

    useEffect(() => {
        props.setScore(score);
    }, [score]);

    const isValidScore: boolean = (() => {
        if (rawScore == null || parseFloat(rawScore)) return true;
        try {
            eval(rawScore);
        } catch (e) {
            return false;
        }

        return true;
    })();

    const showPrompt = (() => {
        if (!isNumber(rawScore)) return false;
        const n = parseFloat(rawScore);
        return 0 < n  && n <= props.weight;
    })();

    function promptPercentClick() {
        setRawScore(rawScore + "%");
    }

    function promptFractionClick() {
        setRawScore(`${rawScore}/${props.weight}`);
    }

    const inputClassName = classNames("assessmentScore", {
        badScore: rawScore !== "" && !isValidScore,
    });

    return (
        <>
            <tr key="norm">
                <td>{props.name}</td>
                <td>{props.weight}%</td>
                <td className="scoreColumn">
                    <ScoreInput value={rawScore} onChange={(v) => setRawScore(v)} className={inputClassName} />
                </td>
                <td className="assessmentGraphColumn hidden-xs">
                    <div className="assessmentGraphContainer">
                        <CircleProgressBar value={score || 0} strokeWidth={10} trailWidth={6} />
                    </div>
                </td>
            </tr>
            {showPrompt && (
                <tr className={""} style={{textAlign: "right"}} key="prompt">
                    <td colSpan={3}>
                        Did you mean <span className="fake-link" onClick={promptPercentClick}>{rawScore}%</span> or <span className="fake-link" onClick={promptFractionClick}>{rawScore}/{props.weight}</span>?
                    </td>
                </tr>
            )}
        </>
    );
};
