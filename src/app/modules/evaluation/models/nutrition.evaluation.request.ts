import { PatientBasic } from '../../patient/models/patient'
import { Measurement } from '../../measurement/models/measurement'
import { BloodGlucose } from '../../measurement/models/blood-glucose'
import { BloodPressure } from '../../measurement/models/blood-pressure'
import { Weight } from '../../measurement/models/weight'
import { PhysicalActivityHabitsRecord } from '../../habits/models/physical.activity'
import { FeedingHabitsRecord } from '../../habits/models/feeding'
import { MedicalRecord } from '../../habits/models/medical.record'
import { SleepHabitsRecord } from '../../habits/models/sleep'

export class NutritionEvaluationRequest {
    patient: PatientBasic;
    measurements: Array<Measurement | BloodGlucose | BloodPressure | Weight>;
    physical_activity_habits: PhysicalActivityHabitsRecord;
    feeding_habits_record: FeedingHabitsRecord;
    medical_record: MedicalRecord;
    sleep_habit: SleepHabitsRecord;
    health_professional_id: string;
    pilotstudy_id: string;

    constructor() {
        this.patient = new PatientBasic();
        this.measurements = new Array<Measurement | BloodGlucose | BloodPressure | Weight>();
        this.physical_activity_habits = new PhysicalActivityHabitsRecord();
        this.feeding_habits_record = new FeedingHabitsRecord();
        this.medical_record = new MedicalRecord();
        this.sleep_habit = new SleepHabitsRecord();
        this.health_professional_id = '';
        this.pilotstudy_id = '';
    }
}
