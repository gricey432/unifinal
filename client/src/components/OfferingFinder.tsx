import React, {useState, useEffect} from "react";
import {RouteComponentProps, useHistory} from "react-router-dom";


type Props = RouteComponentProps<{semesterId: string, courseCode: string | undefined}>;

export const OfferingFinder: React.FunctionComponent<Props> = (props) => {
    const [courseCode, setCourseCode] = useState<string>(props.match.params.courseCode || "");
    const history = useHistory();

    useEffect(() => {
        setCourseCode(props.match.params.courseCode || "");
    }, [props.match.params.courseCode]);

    function semesterSelectChange(uqid: string) {
        history.push(`/${uqid}`);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>, semesterId: string) {
        event.preventDefault();
        history.push(`/${semesterId}/${courseCode}`);
    }

    return (
        <div className="offering-finder-wrapper">
            <select
                className="semester-select"
                value={SEMESTERS.find((sd) => sd.id === props.match.params.semesterId)!.id}
                onChange={(e) => semesterSelectChange(e.target.value)}
            >{
                SEMESTERS.slice(0).reverse().map((sem) => <option key={sem.id} value={sem.id}>{sem.name}</option>)
            }</select>
            <form className="course-input-group" onSubmit={(e) => handleSubmit(e, props.match.params.semesterId)}>
                <input
                    type="text"
                    id="courseCode"
                    title="Course Code"
                    className="course-code"
                    placeholder={PLACEHOLDER_COURSE_CODE}
                    autoComplete="off"
                    spellCheck={false}
                    autoFocus
                    autoCapitalize="characters"
                    name="coursecode"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                />
                <span className="separator"/>
                <button id="btn-load" className="btn btn-light" type="submit">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 28">
                        <path d="M17.297 13.703l-11.594 11.594c-0.391 0.391-1.016 0.391-1.406 0l-2.594-2.594c-0.391-0.391-0.391-1.016 0-1.406l8.297-8.297-8.297-8.297c-0.391-0.391-0.391-1.016 0-1.406l2.594-2.594c0.391-0.391 1.016-0.391 1.406 0l11.594 11.594c0.391 0.391 0.391 1.016 0 1.406z"/>
                    </svg>
                </button>
            </form>
        </div>
    )
};
