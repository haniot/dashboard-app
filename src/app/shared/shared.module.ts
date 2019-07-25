import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedDirectivesModule } from './shared-directives/shared-directives.module';
import { SharedPipesModule } from './shared-pipes/shared-pipes.module';
import { SharedComponentsModule } from './shared-components/shared-components.module';
import { SharedServicesModule } from './shared-services/shared-services.module';

@NgModule({
    imports: [
        CommonModule,
        SharedComponentsModule,
        SharedDirectivesModule,
        SharedPipesModule,
        SharedServicesModule
    ],
    exports: [
        SharedComponentsModule,
        SharedDirectivesModule,
        SharedPipesModule,
        SharedServicesModule
    ]
})
export class SharedModule {
}
