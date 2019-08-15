export enum TeethBrushingFrequency {
    none = 'none',
    once = 'once',
    twice = 'twice',
    three_more = 'three_more'
}

export enum ToothType {
    deciduous_tooth = 'deciduous_tooth',
    permanent_tooth = 'permanent_tooth',
    undefined = 'undefined'

}

export enum LesionType {
    white_spot_lesion = 'white_spot_lesion',
    cavitated_lesion = 'cavitated_lesion',
    undefined = 'undefined'
}

export class ToothLesion {
    tooth_type: ToothType;
    lesion_type: LesionType;

    constructor() {
        this.tooth_type = ToothType.undefined;
        this.lesion_type = LesionType.undefined;
    }

}

export class OralHealthRecord {
    teeth_brushing_freq: TeethBrushingFrequency;
    teeth_lesions: Array<ToothLesion>;

    constructor() {
        this.teeth_brushing_freq = TeethBrushingFrequency.none;
        this.teeth_lesions = new Array<ToothLesion>();
    }

}
