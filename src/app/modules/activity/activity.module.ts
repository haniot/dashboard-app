import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SleepPipe } from './pipes/sleep.pipe'

@NgModule({
    declarations: [SleepPipe],
    exports: [SleepPipe],
    providers: [SleepPipe],
    imports: [
        CommonModule
    ]
})
export class ActivityModule {
}
