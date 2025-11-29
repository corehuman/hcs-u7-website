"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HCSCodeParseError = void 0;
exports.parseHCSCode = parseHCSCode;
class HCSCodeParseError extends Error {
    constructor(message) {
        super(message);
        this.name = "HCSCodeParseError";
    }
}
exports.HCSCodeParseError = HCSCodeParseError;
function parseSegments(code) {
    const parts = code.split("|");
    if (parts.length < 2 || !parts[0].startsWith("HCS-U7")) {
        throw new HCSCodeParseError("Invalid HCS-U7 header");
    }
    const segments = {};
    for (const part of parts.slice(1)) {
        const idx = part.indexOf(":");
        if (idx === -1)
            continue;
        const key = part.slice(0, idx);
        const value = part.slice(idx + 1);
        segments[key] = value;
    }
    return segments;
}
function parseModal(value) {
    const modal = { c: 0, f: 0, m: 0 };
    if (!value)
        return modal;
    const regex = /([cfm])(\d+)/g;
    let match;
    while ((match = regex.exec(value)) !== null) {
        const [, key, num] = match;
        const n = parseInt(num, 10);
        if (key === "c")
            modal.c = n;
        if (key === "f")
            modal.f = n;
        if (key === "m")
            modal.m = n;
    }
    return modal;
}
function parseCognition(value) {
    const scores = {
        form: 0,
        logic: 0,
        visual: 0,
        synthesis: 0,
        creative: 0,
    };
    if (!value)
        return scores;
    const regex = /([A-Z][a-z]?)(\d+)/g;
    const map = {
        F: "form",
        C: "logic",
        V: "visual",
        S: "synthesis",
        Cr: "creative",
    };
    let match;
    while ((match = regex.exec(value)) !== null) {
        const [, code, num] = match;
        const n = parseInt(num, 10);
        const key = map[code];
        if (key) {
            scores[key] = n;
        }
    }
    return scores;
}
function parseInteraction(value) {
    const interaction = {};
    if (!value)
        return interaction;
    for (const part of value.split(",")) {
        const [rawKey, rawVal] = part.split("=", 2);
        if (!rawKey || !rawVal)
            continue;
        interaction[rawKey.trim()] = rawVal.trim();
    }
    return interaction;
}
function parseHCSCode(raw) {
    var _a, _b, _c;
    const code = raw.trim();
    if (!code) {
        throw new HCSCodeParseError("Empty HCS-U7 code");
    }
    const segments = parseSegments(code);
    const version = (_a = segments["V"]) !== null && _a !== void 0 ? _a : "7.0";
    const algorithm = (_b = segments["ALG"]) !== null && _b !== void 0 ? _b : "QS";
    const element = (_c = segments["E"]) !== null && _c !== void 0 ? _c : "E";
    const modal = parseModal(segments["MOD"]);
    const cognition = parseCognition(segments["COG"]);
    const interaction = parseInteraction(segments["INT"]);
    const qsig = segments["QSIG"];
    const b3 = segments["B3"];
    return {
        rawCode: code,
        version,
        algorithm,
        element,
        modal,
        cognition,
        interaction,
        qsig,
        b3,
    };
}
