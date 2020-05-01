declare class Circle {
    constructor(el: HTMLElement, options: any);
    destroy(): void;
    animate(n: number): void;
}

declare module "progressbar.js/src/circle.js" {
    export = Circle;
}
