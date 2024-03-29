import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {UIToast, UIToastComponent, UIToastRef} from 'altair-ui';
import {UserService} from '../user-service/user.service';
import {BaseError} from '../../helpers/error/BaseError';
import {ClientError} from '../../helpers/error/ClientError';

@Component({
    selector: 'forget-pass',
    templateUrl: './forget-pass.html',
    styleUrls: ['./forget-pass.less']
})
export class ForgetPass implements OnDestroy {
    private _subscription = new Subscription();
    private _toastRef: UIToastRef<UIToastComponent>;

    @ViewChild('emailInput', {static: false}) emailInput: ElementRef;

    result = false;
    isPending = false;

    constructor(private _userService: UserService,
                toast: UIToast) {
        this._toastRef = toast.makeText();
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    onSubmit(event: Event) {
        if (this.isPending) {
            return;
        }
        this.isPending = true;
        event.stopPropagation();
        event.preventDefault();
        let value = (this.emailInput.nativeElement as HTMLInputElement).value;
        this._subscription.add(this._userService.requestResetPass(value)
            .subscribe(
                () => {
                    this.isPending = false;
                    this._toastRef.show(`密码重置邮件将被发送至 ${value}`);
                    this.result = true;
                },
                (error: BaseError) => {
                    this.isPending = false;
                    if (error.message === ClientError.MAIL_NOT_EXISTS) {
                        this._toastRef.show('无法发送邮件至 ${value} ，请检查您输入的邮箱地址是否正确。');
                    } else {
                        this._toastRef.show(error.message);
                    }
                }
            ));
    }
}
