import {Config} from "./types";
import {uq} from "./uq";
import {qut} from "./qut";
import {griffith} from "./griffith";

export {Config};
export const configs: Array<Config> = [
    uq,
    qut,
    griffith,
];
