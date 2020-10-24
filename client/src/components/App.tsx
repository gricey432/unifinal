import * as React from "react";
import {useState} from "react";
import {BrowserRouter, Route, Redirect} from "react-router-dom";
import * as Cookie from "js-cookie";
import * as tinyColor from "tinycolor2";

import {DisclaimerNotice} from "./DisclaimerNotice";
import {CourseRoute} from "./CourseRoute";
import {OfferingFinder} from "./OfferingFinder";


const NOTICE_DISMISSED_COOKIE_NAME = "uqfinalnotice";


const App: React.FunctionComponent = () => {
    const [showDisclaimer, setShowDisclaimer] = useState<boolean>(() => Cookie.get(NOTICE_DISMISSED_COOKIE_NAME) !== "true");

    function handleDismissDisclaimer() {
        setShowDisclaimer(false);
        Cookie.set(NOTICE_DISMISSED_COOKIE_NAME, "true",  { expires: 30 });
    }

    function randomiseBackground() {
        window.ga('send', 'event', 'Easter', 'colour');
        // XXX: tinycolor is mutable
        const colour = tinyColor.random();
        const left = colour.clone().spin(-40);
        const right = colour.clone().spin(40);
        document.body.style.background = `linear-gradient(-45deg, ${left.toString()}, ${colour.toString()}, ${right.toString()})`;
        document.body.style.backgroundSize = "400% 400%";
    }

    return (
        <>
            <div className="colour-button" onClick={randomiseBackground}/>
            <div className="container">
                <div className="header"/>
                <Route path="/" exact render={() => {
                    // Default to latest semester
                    const semesterId: string = SEMESTERS[SEMESTERS.length - 1].id;
                    return <Redirect to={"/" + semesterId}/>;
                }} />

                <Route path="/:semesterId/:courseCode?" component={OfferingFinder} />
                <Route path="/:semesterId/:courseCode" component={CourseRoute} />
                {showDisclaimer && <DisclaimerNotice onClickDismiss={handleDismissDisclaimer}/>}
            </div>
        </>
    )
};


// App has to be wrapped in a router so that the useHistory works
export const WrappedApp: React.FunctionComponent = () => {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
};
