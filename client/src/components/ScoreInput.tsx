import * as React from "react";
import {useState, useEffect} from "react";


type Props = {
    value: string;
    onChange: (value: string) => void;
    className: string;
}

export const ScoreInput: React.FunctionComponent<Props> = (props) => {
    const [value, setValue] = useState<string>(props.value);

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    function onInputBlur () {
        props.onChange(value);
    }

    return <input
        type="text"
        title="Score"
        className={props.className}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={onInputBlur}
    />;
};
