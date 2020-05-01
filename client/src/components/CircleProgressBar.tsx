import * as React from "react";
import Circle = require("progressbar.js/src/circle.js");


type Props = {
    value: number; // 0.0 to 1.0
    strokeWidth: number;
    trailWidth: number;
};

export class CircleProgressBar extends React.Component<Props> {
    protected el?: HTMLDivElement | null;
    protected bar?: Circle;

    componentDidMount(): void {
        this.bar = new Circle(this.el!, {
            strokeWidth: this.props.strokeWidth,
            easing: 'easeOut',
            color: CHART_COLOUR,
            trailColor: '#eee',
            trailWidth: this.props.trailWidth,
        });
    }

    componentWillUnmount(): void {
        this.bar!.destroy();
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
        this.bar!.animate(this.props.value);
    }

    render() {
        return <div ref={(el) => this.el = el} />;
    }
}
