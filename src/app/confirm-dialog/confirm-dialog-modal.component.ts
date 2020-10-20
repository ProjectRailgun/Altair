import { Component, Input } from '@angular/core';
import { UIDialogRef } from 'altair-ui';
@Component({
    selector: 'confirm-dialog-modal',
    templateUrl: './confirm-dialog-modal.html',
    styleUrls: ['./confirm-dialog-modal.less']
})
export class ConfirmDialogModal {

    @Input()
    title;

    @Input()
    content;

    constructor(private _dialogRef: UIDialogRef<ConfirmDialogModal>) { }

    cancel() {
        this._dialogRef.close('cancel');
    }

    confirm() {
        this._dialogRef.close('confirm');
    }
}
