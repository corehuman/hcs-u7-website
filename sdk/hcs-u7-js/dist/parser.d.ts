import type { HCSProfile } from "./types";
export declare class HCSCodeParseError extends Error {
    constructor(message: string);
}
export declare function parseHCSCode(raw: string): HCSProfile;
