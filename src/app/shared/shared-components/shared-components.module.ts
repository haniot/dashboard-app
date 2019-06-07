import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {CardTopComponent} from './card-top/card-top.component';
import {HaniotCardComponent} from './haniot-card/haniot-card.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {SharedPipesModule} from '../shared-pipes/shared-pipes.module';
import {HaniotModalComponent} from './haniot-modal/haniot-modal.component';
import {ModalService} from './haniot-modal/service/modal.service';
import {LoadingComponentComponent} from './loading-component/loading-component.component';
import {ModalConfirmationComponent} from './modal-confirmation/modal-confirmation.component';
import {LoadingService} from './loading-component/service/loading.service';
import {SelectPilotstudyComponent} from './select-pilotstudy/select-pilotstudy.component';
import {SelectPilotStudyService} from "./select-pilotstudy/service/select-pilot-study.service";
import {MatStepperModule} from "@angular/material";

@NgModule({
    declarations: [
        CardTopComponent,
        HaniotCardComponent,
        HaniotModalComponent,
        LoadingComponentComponent,
        ModalConfirmationComponent,
        SelectPilotstudyComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatPaginatorModule,
        SharedPipesModule,
        MatStepperModule,

    ],
    exports: [
        CardTopComponent,
        HaniotCardComponent,
        HaniotModalComponent,
        LoadingComponentComponent,
        ModalConfirmationComponent,
        SelectPilotstudyComponent
    ],
    providers: [
        ModalService,
        LoadingService
    ]
})
export class SharedComponentsModule {
}