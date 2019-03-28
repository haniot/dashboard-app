import { NgModule } from '@angular/core';

import { SharedDirectivesModule } from './shared-directives/shared-directives.module';
import { SharedPipesModule } from './shared-pipes/shared-pipes.module';
import { SharedComponentsModule } from './shared-components/shared-components.module';

@NgModule({
  imports: [
    SharedComponentsModule,
    SharedDirectivesModule,
    SharedPipesModule
  ],
  exports:[
    SharedComponentsModule,
    SharedDirectivesModule,
    SharedPipesModule
  ]
})
export class SharedModule { }
