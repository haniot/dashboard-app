import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HealthAreaPipe} from './pipes/health-area.pipe';
import {GenderPipe} from './pipes/gender.pipe';
import {MyDatePipe} from './pipes/my-date.pipe';
import {ConvertInAgePipe} from "./pipes/age.pipe";
import { PilotStudyStatePipe } from './pipes/pilot-study-state.pipe';

@NgModule({
    declarations: [
        HealthAreaPipe,
        GenderPipe,
        MyDatePipe,
        ConvertInAgePipe,
        PilotStudyStatePipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        HealthAreaPipe,
        GenderPipe,
        MyDatePipe,
        ConvertInAgePipe,
        PilotStudyStatePipe
    ]
})
export class SharedPipesModule {
}
