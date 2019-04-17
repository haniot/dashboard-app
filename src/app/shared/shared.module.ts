import { NgModule } from '@angular/core';

import { SharedDirectivesModule } from './shared-directives/shared-directives.module';
import { SharedPipesModule } from './shared-pipes/shared-pipes.module';
import { SharedComponentsModule } from './shared-components/shared-components.module';
import { SharedServicesModule } from './shared-services/shared-services.module';

@NgModule({
  imports: [
    SharedComponentsModule,
    SharedDirectivesModule,
    SharedPipesModule,
    SharedServicesModule
  ],
  exports:[
    SharedComponentsModule,
    SharedDirectivesModule,
    SharedPipesModule,
    SharedServicesModule
  ]
})
export class SharedModule { }
