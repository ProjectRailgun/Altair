import {NgModule} from '@angular/core';
import {ConfirmDialogDirective} from './confirm-dialog.directive';
import {UIDialogModule} from 'altair-ui';
import {ConfirmDialogModal} from './confirm-dialog-modal.component';

@NgModule({
    declarations: [ConfirmDialogDirective, ConfirmDialogModal],
    imports: [UIDialogModule],
    exports: [ConfirmDialogDirective],
    entryComponents: [ConfirmDialogModal]
})
export class ConfirmDialogModule {

}

export * from './confirm-dialog.directive';
