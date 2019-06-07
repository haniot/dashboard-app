export enum ChronicDiseaseType {
    hipertension = "hipertension",
    blood_fat = "blood_fat",
    diabetes = "diabetes"
}

export enum DiseaseHistory {
    yes = "yes",
    no = "no",
    undefined = "undefined"
}

export class ChronicDisease {
    type: string;
    disease_history: string;
}
export class MedicalRecord {
    id: string;
    created_at: string;
    chronic_diseases: Array<ChronicDisease>;
}
