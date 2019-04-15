enum ChronicDiseaseType{
    hipertension, blood_fat, diabetes
}

enum DiseaseHistory{
    yes, no, undefined
}

export class ChronicDisease{
    type: string;
    disease_history: string;
}
export class MedicalRecord{
    id: string;
    created_at: string;
    chronic_diseases: Array<ChronicDisease>;
}
