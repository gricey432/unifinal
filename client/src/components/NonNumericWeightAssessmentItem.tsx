import * as React from "react";


type Props = {
    name: string;
    weight: string | number;
}


export const NonNumericWeightAssessmentItem: React.FunctionComponent<Props> = (props) => {
    return (
        <tr>
            <td>{props.name}</td>
            <td>{props.weight}</td>
            <td className="scoreColumn">
                <input type="text" className="assessmentScore" disabled />
            </td>
            <td className="assessmentGraphColumn hidden-xs"/>
        </tr>
    );
};
