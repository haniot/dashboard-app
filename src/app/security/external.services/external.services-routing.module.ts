import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExternalServiceComponent } from './external.service/external.service.component'
import { EscapeComponent } from './escape/escape.component'

const routes = [
    { path: 'fitbit', component: ExternalServiceComponent },
    { path: 'invalid', component: EscapeComponent },
    { path: '**', redirectTo: 'invalid' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExternalServicesRoutingModule {
}
