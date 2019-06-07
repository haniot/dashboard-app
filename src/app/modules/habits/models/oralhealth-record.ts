export enum TeethBrushingFrequency {
    none = "none",
    once = "once",
    twice = "twice",
    three_more = "three_more"
}

export enum ToothType {
    deciduous_tooth = "deciduous_tooth",
    permanent_tooth = "permanent_tooth"
}

export enum LesionType {
    white_spot_lesion = "white_spot_lesion",
    cavitated_lesion = "cavitated_lesion"
}

export class ToothLesion {
    tooth_type: ToothType;
    lesion_type: LesionType;
}

export class OralHealthRecord {
    id: string;
    created_at: string;
    teeth_brushing_freq: TeethBrushingFrequency;
    teeth_lesions: Array<ToothLesion>
}