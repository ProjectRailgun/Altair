import {Component, Input} from '@angular/core';
import {UIDialogRef} from 'altair-ui';

@Component({
    selector: 'alert-dialog',
    templateUrl: './alert-dialog.html',
    styleUrls: ['./alert-dialog.less']
})
export class AlertDialog {
    @Input()
    confirmButtonText: string;

    @Input()
    title: string;

    @Input()
    content: string;


    constructor(private _dialogRef: UIDialogRef<AlertDialog>) {
    }

    confirm() {
        this._dialogRef.close('confirm');
    }
}
