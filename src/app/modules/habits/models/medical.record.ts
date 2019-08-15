export enum ChronicDiseaseType {
    hipertension = 'hipertension',
    blood_fat = 'blood_fat',
    diabetes = 'diabetes'
}

export enum DiseaseHistory {
    yes = 'yes',
    no = 'no',
    undefined = 'undefined'
}

export class ChronicDisease {
    type: string;
    disease_history: string;

    constructor() {
        this.type = '';
        this.disease_history = '';
    }

}

export class MedicalRecord {
    chronic_diseases: Array<ChronicDisease>;

    constructor() {
        this.chronic_diseases = new Array<ChronicDisease>();
    }

}
