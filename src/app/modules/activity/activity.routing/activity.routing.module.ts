import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SleepComponent } from '../sleep/sleep.component'
import { ActivityDetailsComponent } from '../activity.details/activity.details.component'

const routes = [
    { path: 'sleep/:patientId', component: SleepComponent },

    { path: 'physical_activity/:patientId', component: ActivityDetailsComponent },

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
