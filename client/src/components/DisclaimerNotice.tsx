import * as React from "react";


type Props = {
    onClickDismiss(): void;
}

export const DisclaimerNotice: React.FunctionComponent<Props> = (props) => {
    return (
        <div className="notice-wrapper">
            <div className="notice-inner-wrapper">
                <p className="font-weight-bold">Please Note:</p>
                <p>This calculator is not made by the University. It assumes generic grade cutoffs, which may be wrong for some courses. Always check against the official course profile.</p>
                <div className="btn-wrapper"><button className="btn" onClick={props.onClickDismiss}>I Understand</button></div>
            </div>
        </div>
    )
};
