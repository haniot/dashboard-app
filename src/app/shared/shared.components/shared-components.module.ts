import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatStepperModule} from "@angular/material";
import {MatPaginatorModule} from '@angular/material/paginator';

import {TranslateModule} from "@ngx-translate/core";

import {CardTopComponent} from './card.top/card.top.component';
import {HaniotCardComponent} from './haniot.card/haniot.card.component';
import {SharedPipesModule} from '../shared.pipes/shared.pipes.module';
import {HaniotModalComponent} from './haniot.modal/haniot.modal.component';
import {ModalService} from './haniot.modal/service/modal.service';
import {LoadingComponent} from './loading.component/loading.component';
import {ModalConfirmationComponent} from './modal.confirmation/modal.confirmation.component';
import {LoadingService} from './loading.component/service/loading.service';
import {SelectPilotstudyComponent} from './select.pilotstudy/select.pilotstudy.component';
import {SpinnerComponent} from './spinner/spinner.component';
import { HaniotSubcardComponent } from './haniot.subcard/haniot.subcard.component';

@NgModule({
    declarations: [
        CardTopComponent,
        HaniotCardComponent,
        HaniotModalComponent,
        LoadingComponent,
        ModalConfirmationComponent,
        SelectPilotstudyComponent,
        SpinnerComponent,
        HaniotSubcardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatPaginatorModule,
        SharedPipesModule,
        MatStepperModule,
        TranslateModule

    ],
    exports: [
        CardTopComponent,
        HaniotCardComponent,
        HaniotModalComponent,
        LoadingComponent,
        ModalConfirmationComponent,
        SelectPilotstudyComponent,
        SpinnerComponent,
        HaniotSubcardComponent
    ],
    providers: [
        ModalService,
        LoadingService
    ]
})
export class SharedComponentsModule {
}
