import * as React from "react";
import "./Spinner.scss";

export const Spinner: React.FunctionComponent = () => {
    return (
        <div className="spinner">
            <div className="bounce1"/>
            <div className="bounce2"/>
            <div className="bounce3"/>
        </div>
    );
};
