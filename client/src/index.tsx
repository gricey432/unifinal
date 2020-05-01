import * as React from "react";
import * as ReactDOM from "react-dom";

import {WrappedApp} from "./components/App";
import "./app.scss";


// Must line up with webpack config file
declare global {
    const CHART_COLOUR: string;
    const PLACEHOLDER_COURSE_CODE: string;
    const SEMESTERS: Array<{  // Ordered oldest to newest
        id: string;
        name: string;
    }>;
    const DEFAULT_CUTOFFS: Array<number>;

    // Hack for readonly array
    interface ArrayConstructor {
        isArray(arg: ReadonlyArray<any> | any): arg is ReadonlyArray<any>
    }
    
    interface Window {
        adsbygoogle: any;
        ga: any;
    }
}


ReactDOM.render(
    <WrappedApp />,
    document.getElementById("app")
);
