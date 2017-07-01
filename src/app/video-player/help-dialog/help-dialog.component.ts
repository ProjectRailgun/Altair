import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Self, ViewChild } from '@angular/core';
import { UIDialogRef } from 'deneb-ui';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

export const KEY_ESC = 27;

@Component({
    selector: 'video-player-help-dialog',
    templateUrl: './help-dialog.html',
    styleUrls: ['./help-dialog.less'],
    host: {
        'tabIndex': '-1'
    }
})
export class VideoPlayerHelpDialog implements OnInit, AfterViewInit, OnDestroy {
    private _subscription = new Subscription();

    @ViewChild('closeButton') closeButton: ElementRef;

    constructor(private _dialogRef: UIDialogRef<VideoPlayerHelpDialog>) {
    }

    closeDialog(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this._dialogRef.close(null);
    }

    ngOnInit(): void {
        this._subscription.add(
            Observable.fromEvent(document, 'keyup')
                .map((event: KeyboardEvent) => {
                    return event.which;
                })
                .filter(code => code === KEY_ESC)
                .subscribe(() => {
                    this._dialogRef.close();
                })
        );
    }

    ngAfterViewInit(): void {
        let closeButtonElement = this.closeButton.nativeElement as HTMLElement;
        closeButtonElement.focus();
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }
}
