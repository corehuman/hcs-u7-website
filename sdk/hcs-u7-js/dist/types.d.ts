export interface ModalDistribution {
    c: number;
    f: number;
    m: number;
}
export interface CognitionScores {
    form: number;
    logic: number;
    visual: number;
    synthesis: number;
    creative: number;
}
export interface InteractionSettings {
    PB?: string;
    SM?: string;
    TN?: string;
    [key: string]: string | undefined;
}
export interface HCSProfile {
    rawCode: string;
    version: string;
    algorithm: string;
    element: string;
    modal: ModalDistribution;
    cognition: CognitionScores;
    interaction: InteractionSettings;
    qsig?: string;
    b3?: string;
}
