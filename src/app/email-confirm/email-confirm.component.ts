import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { EmailConfirmService } from './email-confirm.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { UserService } from '../user-service/user.service';

@Component({
    selector: 'email-confirm',
    templateUrl: './email-confirm.html',
    styleUrls: ['./email-confirm.less'],
    encapsulation: ViewEncapsulation.None
})
export class EmailConfirm implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    isLoading = true;

    emailValid = false;

    constructor(private _confirmService: EmailConfirmService,
        private _userService: UserService,
        private _router: Router) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        let searchString = window.location.search;
        if (searchString) {
            this._subscription.add(
                this._confirmService.confirmEmail(searchString.substring(1, searchString.length))
                    .flatMap(() => {
                        return this._userService.getUserInfo();
                    })
                    .subscribe(() => {
                        this.isLoading = false;
                        this.emailValid = true;
                    }, () => {
                        this.isLoading = false;
                        this.emailValid = false;
                    })
            );
        } else {
            this.isLoading = false;
            this.emailValid = false;
        }
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    returnToHome() {
        this._router.navigateByUrl('/');
    }
}
