import { SocioDemographicRecord } from './socio.demographic.record'
import { FamilyCohesionRecord } from './family.cohesion.record'
import { OralHealthRecord } from './oral.health.record'

export class OdontologicalQuestionnaire {
    id: string;
    created_at: string;
    sociodemographic_recod: SocioDemographicRecord;
    family_cohesion_record: FamilyCohesionRecord;
    oral_health_record: OralHealthRecord;

    constructor() {
        this.id = '';
        this.created_at = '';
        this.sociodemographic_recod = new SocioDemographicRecord();
        this.family_cohesion_record = new FamilyCohesionRecord();
        this.oral_health_record = new OralHealthRecord();
    }

}
