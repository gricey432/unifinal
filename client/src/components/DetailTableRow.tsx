import * as React from "react";
import classNames from "classnames";


type Props = {
    grade: string;
    cutoff: number;
    totalScore: number;
    unprovidedTotalWeight: number;
}

export const DetailTableRow: React.FunctionComponent<Props> = (props) => {
    const requiredPercent = Math.max(0, Math.ceil((props.cutoff - props.totalScore) / props.unprovidedTotalWeight * 100));
    const requiredScore = Math.ceil(requiredPercent / 100 * props.unprovidedTotalWeight);

    const className = classNames({
        'bg-success': requiredPercent === 0,
        'bg-danger': requiredPercent > 100,
    });

    return (
        <tr className={className}>
            <td>{props.grade}</td>
            <td className="text-right">{props.cutoff}</td>
            <td className="text-right">{requiredPercent}%</td>
            <td className="text-right">{requiredScore}/{props.unprovidedTotalWeight}</td>
        </tr>
    );
};
