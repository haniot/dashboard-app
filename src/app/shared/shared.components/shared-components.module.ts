import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatStepperModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';

import { CardTopComponent } from './card.top/card.top.component';
import { CardComponent } from './card/card.component';
import { SharedPipesModule } from '../shared.pipes/shared.pipes.module';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './modal/service/modal.service';
import { LoadingComponent } from './loading.component/loading.component';
import { ModalConfirmationComponent } from './modal.confirmation/modal.confirmation.component';
import { SelectPilotstudyComponent } from './select.pilotstudy/select.pilotstudy.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { SubcardComponent } from './subcard/subcard.component';
import { DashboardCardComponent } from './dashboard.card/dashboard.card.component';

@NgModule({
    declarations: [
        CardTopComponent,
        CardComponent,
        ModalComponent,
        LoadingComponent,
        ModalConfirmationComponent,
        SelectPilotstudyComponent,
        SpinnerComponent,
        SubcardComponent,
        DashboardCardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatPaginatorModule,
        SharedPipesModule,
        MatStepperModule,
        TranslateModule,
        RouterModule

    ],
    exports: [
        CardTopComponent,
        CardComponent,
        ModalComponent,
        LoadingComponent,
        ModalConfirmationComponent,
        SelectPilotstudyComponent,
        SpinnerComponent,
        SubcardComponent,
        DashboardCardComponent
    ],
    providers: [
        ModalService
    ]
})
export class SharedComponentsModule {
}
