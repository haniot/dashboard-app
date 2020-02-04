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
import { TimeSeriesCardComponent } from './time.series.card/time.series.card.component'
import { SatDatepickerModule } from 'saturn-datepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatInputModule } from '@angular/material/input'

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
        DashboardCardComponent,
        TimeSeriesCardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatPaginatorModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        SatDatepickerModule,
        MatFormFieldModule,
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
        DashboardCardComponent,
        TimeSeriesCardComponent
    ],
    providers: [
        ModalService
    ]
})
export class SharedComponentsModule {
}
