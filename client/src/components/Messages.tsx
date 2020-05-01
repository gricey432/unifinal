import * as React from "react";


type Props = {
    messages: Array<string>;
}


export const Messages: React.FunctionComponent<Props> = (props) => {
    return (
        <div className="messages">
            {props.messages.map((msg) => <div key={msg} className="message">{msg}</div>)}
        </div>
    );
};
