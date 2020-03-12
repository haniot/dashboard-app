import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncludeDataTypeDirective } from './include.data.type.directive'

@NgModule({
    declarations: [IncludeDataTypeDirective],
    imports: [
        CommonModule
    ],
    exports: [IncludeDataTypeDirective]
})
export class SharedDirectivesModule {
}
