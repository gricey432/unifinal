import * as React from "react";
import {useEffect} from "react";


export const Ad: React.FunctionComponent = () => {
    useEffect(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, []);

    return (
        <ins className="ad adsbygoogle"
            style={{display: "block"}}
            data-ad-client="ca-pub-2317507588833671"
            data-ad-slot="7693315322"
            data-ad-format="auto"
            data-full-width-responsive="true"
        />
    )
};
