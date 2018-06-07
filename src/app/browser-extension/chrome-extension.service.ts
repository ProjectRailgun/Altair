import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BangumiAuthDialogComponent } from './bangumi-auth-dialog/bangumi-auth-dialog.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Bangumi } from '../entity';

export interface RPCMessage {
    className: string;
    method: string;
    args: any[];
}

export interface RPCResult {
    error: any | null;
    result: any | null;
}

export interface IAuthInfo {
    id: string; // user's uid
    url: string; // user url
    username: string; // user's uid, wtf
    nickname: string;
    avatar: {
        large: string; // large image url
        medium: string; // medium image url
        small: string; // small image url
    };
    sign: string;
    auth: string; // issued by auth server, used in ${AUTH_TOKEN}
    auth_encode?: string; // ${AUTH_TOKEN) encoded by urlencode()
}

export type INITIAL_STATE = 0;
export type AuthInfo = IAuthInfo | null | INITIAL_STATE;

export const INITIAL_STATE_VALUE = 0;

export enum LOGON_STATUS {
    UNSURE,
    TRUE,
    FALSE
}

@Injectable()
export class ChromeExtensionService {
    private _authInfo = new BehaviorSubject<AuthInfo>(INITIAL_STATE_VALUE);
    private _isBgmTvLogon = new BehaviorSubject<LOGON_STATUS>(
        LOGON_STATUS.UNSURE
    );
    private _isEnabled = new BehaviorSubject<boolean>(false);

    get isEnabled(): Observable<boolean> {
        return this._isEnabled.asObservable();
    }

    chromeExtensionId: string;

    get authInfo(): Observable<AuthInfo> {
        return this._authInfo.asObservable();
    }

    get isBgmTvLogon(): Observable<LOGON_STATUS> {
        return this._isBgmTvLogon.asObservable();
    }

    constructor(private _ngZone: NgZone) {
        if (CHROME_EXTENSION_ID) {
            this.chromeExtensionId = CHROME_EXTENSION_ID;
        }
        if (
            !!window &&
            !!window.chrome &&
            !!window.chrome.runtime &&
            !!this.chromeExtensionId
        ) {
            console.log(
                '%c Altair %c Deneb detected. ',
                'color: #fff; margin: 1em 0; padding: 5px 0; background: #3498db;',
                'margin: 1em 0; padding: 5px 0; background: #efefef;'
            );
            this.isEnabled.filter(isEnabled => isEnabled).subscribe(() => {
                this.invokeBangumiMethod('getAuthInfo', []).subscribe(
                    authInfo => {
                        this._authInfo.next(authInfo);
                    }
                );
                this.invokeBangumiWebMethod('checkLoginStatus', []).subscribe(
                    result => {
                        if (result.isLogin) {
                            this._isBgmTvLogon.next(LOGON_STATUS.TRUE);
                        } else {
                            this._isBgmTvLogon.next(LOGON_STATUS.FALSE);
                        }
                    }
                );
            });
            this._ngZone.run(() => {
                chrome.runtime.sendMessage(
                    this.chromeExtensionId,
                    {
                        className: 'BackgroundCore',
                        method: 'verify',
                        args: []
                    },
                    resp => {
                        if (resp && resp.result === 'token:' + this.chromeExtensionId) {
                            this._isEnabled.next(true);
                        } else {
                            this._isEnabled.next(false);
                        }
                    }
                );
            });
            console.log(
                '%c Altair %c Deneb integrated & syncing. ',
                'color: #fff; margin: 1em 0; padding: 5px 0; background: #3498db;',
                'margin: 1em 0; padding: 5px 0; background: #efefef;'
            );
        } else {
            this._isEnabled.next(false);
        }
    }

    invokeBangumiMethod(method: string, args: any[]): Observable<any> {
        return this.invokeRPC('BangumiAPIProxy', method, args);
    }

    invokeBangumiWebMethod(method: string, args: any[]): Observable<any> {
        return this.invokeRPC('BangumiWebProxy', method, args);
    }

    auth(username: string, password: string): Observable<any> {
        return this.invokeBangumiMethod('auth', [username, password]).do(
            data => {
                this._authInfo.next(data);
            }
        );
    }

    openBgmForResult(): Observable<any> {
        return this.invokeRPC('BackgroundCore', 'openBgmForResult', []).do(
            () => {
                this._isBgmTvLogon.next(LOGON_STATUS.TRUE);
            }
        );
    }

    revokeAuth(): Observable<any> {
        return this.invokeBangumiMethod('revokeAuth', []).do(() => {
            this._authInfo.next(null);
        });
    }

    syncBangumi(bangumi: Bangumi): Observable<any> {
        return this.invokeRPC('Synchronize', 'syncOne', [bangumi]);
    }

    solveConflict(
        bangumi: Bangumi,
        bgmFavStatus: number,
        choice: string
    ): Observable<any> {
        return this.invokeRPC('Synchronize', 'solveConflict', [
            bangumi,
            bgmFavStatus,
            choice
        ]);
    }

    updateFavoriteAndSync(bangumi: Bangumi, favStatus: any): Observable<any> {
        return this.invokeRPC('Synchronize', 'updateFavorite', [
            bangumi,
            favStatus
        ]);
    }

    deleteFavoriteAndSync(bangumi: Bangumi): Observable<any> {
        return this.invokeRPC('Synchronize', 'deleteFavorite', [bangumi]);
    }

    syncProgress(bangumi: Bangumi): Observable<any> {
        return this.invokeRPC('Synchronize', 'syncProgress', [bangumi]);
    }

    private invokeRPC(
        className: string,
        method: string,
        args: any[]
    ): Observable<any> {
        return new Observable<any>(observer => {
            chrome.runtime.sendMessage(
                this.chromeExtensionId,
                {
                    className: className,
                    method: method,
                    args: args
                },
                (resp: RPCResult) => {
                    this._ngZone.run(() => {
                        if (resp && !resp.error) {
                            observer.next(resp.result);
                        } else {
                            observer.error(resp ? resp.error : 'unknown error');
                        }
                        observer.complete();
                    });
                }
            );
        });
    }
}
