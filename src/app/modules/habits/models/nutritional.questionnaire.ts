import { SleepHabitsRecord } from './sleep'
import { PhysicalActivityHabitsRecord } from './physical.activity'
import { FeedingHabitsRecord } from './feeding'
import { MedicalRecord } from './medical.record'

export class NutritionalQuestionnaire {
    id: string;
    created_at: string;
    sleep_habit: SleepHabitsRecord;
    physical_activity_habits: PhysicalActivityHabitsRecord;
    feeding_habits_record: FeedingHabitsRecord;
    medical_record: MedicalRecord;

    constructor() {
        this.id = '';
        this.created_at = new Date().toDateString();
        this.sleep_habit = new SleepHabitsRecord();
        this.physical_activity_habits = new PhysicalActivityHabitsRecord();
        this.feeding_habits_record = new FeedingHabitsRecord();
        this.medical_record = new MedicalRecord();
    }

}
