import { SocioDemographicRecord } from './socio.demographic.record'
import { FamilyCohesionRecord } from './family.cohesion.record'
import { OralHealthRecord } from './oral.health.record'

export class OdontologicalQuestionnaire {
    id: string;
    created_at: string;
    sociodemographic_record: SocioDemographicRecord;
    family_cohesion_record: FamilyCohesionRecord;
    oral_health_record: OralHealthRecord;

    constructor() {
        this.id = '';
        this.created_at = '';
        this.sociodemographic_record = undefined;
        this.family_cohesion_record = undefined;
        this.oral_health_record = undefined;
    }

}
