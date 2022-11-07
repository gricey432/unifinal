import * as React from "react";
import {useState, useEffect} from "react";
import {RouteComponentProps} from "react-router-dom";
import {Map, List} from "immutable";

import {OfferingData} from "../api";
import {Course} from "./Course";
import {Spinner} from "./Spinner";
import {Ad} from "./Ad";
import {Messages} from "./Messages";


export const CourseRoute: React.FunctionComponent<RouteComponentProps<{semesterId: string; courseCode: string}>> = (props) => {
    const semesterId = props.match.params.semesterId;
    const courseCode = props.match.params.courseCode;

    const [offeringData, setOfferingData] = useState<OfferingData | undefined>();
    const [badCourseCode, setBadCourseCode] = useState<boolean>(false);

    async function loadOffering() {
        setBadCourseCode(false);
        setOfferingData(undefined);
        try {
            const resp = await fetch(`/data/${semesterId}/${courseCode}.json`);
            if (!resp.ok) throw Error();
            const data: OfferingData = await resp.json();
            setOfferingData(data);
        } catch (e) {
            setBadCourseCode(true);
        }
    }

    useEffect(() => {
        loadOffering();
    }, [semesterId, courseCode]);

    if (offeringData) {
        return (
            <>
                <Course
                    code={courseCode}
                    message={offeringData.message ?? null}
                    cutoffs={List(offeringData.cutoffs ?? DEFAULT_CUTOFFS)}
                    assessmentItems={List(offeringData.assessment)}
                />
                <Ad />
            </>
        );
    } else if (badCourseCode) {
        return (
            <Messages
                messages={["Invalid course code"]}
            />
        )
    } else {
        return <Spinner/>;
    }
};
