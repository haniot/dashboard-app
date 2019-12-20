import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SleepComponent } from '../sleep/sleep.component'
import { ActivityDetailsComponent } from '../activity.details/activity.details.component'

const routes = [
    { path: ':patientId/sleep', component: SleepComponent },

    { path: ':patientId/sleep/:sleepId', component: SleepComponent },

    { path: ':patientId/physical_activity', component: ActivityDetailsComponent },

    { path: ':patientId/physical_activity/:activityId', component: ActivityDetailsComponent },

    { path: '**', redirectTo: 'page-not-found' }

];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class ActivityRoutingModule {
}
