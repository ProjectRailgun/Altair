import {fromEvent as observableFromEvent, Subscription} from 'rxjs';

import {skip} from 'rxjs/operators';
import {UIPopoverContent, UIPopoverRef} from 'altair-ui';
import {Component, Input, OnDestroy} from '@angular/core';
import {User} from '../../../entity';

@Component({
    selector: 'user-action-panel',
    templateUrl: './user-action-panel.html',
    styleUrls: ['./user-action-panel.less']
})
export class UserActionPanelComponent extends UIPopoverContent implements OnDestroy {
    private _subscription = new Subscription();

    @Input()
    user: User;

    @Input()
    isBangumiEnabled: boolean;

    @Input()
    bgmAccountInfo: {
        nickname: string,
        avatar: { large: string, medium: string, small: string },
        username: string,
        id: string,
        url: string
    };

    constructor(popoverRef: UIPopoverRef<UserActionPanelComponent>) {
        super(popoverRef);
    }

    logout(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.popoverRef.close('logout');
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        this._subscription.add(
            observableFromEvent(document.body, 'click').pipe(
                skip(1))
                .subscribe(() => {
                    this.popoverRef.close(null);
                })
        );
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}
