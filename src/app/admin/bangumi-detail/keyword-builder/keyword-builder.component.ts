import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FeedService} from '../feed.service';
import {FormControl} from '@angular/forms';
import {UIDialogRef, UIToast, UIToastComponent, UIToastRef} from 'altair-ui';
import {Subscription} from 'rxjs';
import {AVAILABLE_CATEGORY, AVAILABLE_FILTER} from '../../bangumi-pipes/nyaa-pipe';

@Component({
    selector: 'keyword-builder',
    templateUrl: './keyword-builder.html',
    styleUrls: ['./keyword-builder.less']
})
export class KeywordBuilder implements OnInit, OnDestroy {
    private _subscription = new Subscription();
    private _toastRef: UIToastRef<UIToastComponent>;

    @Input()
    keyword: string;
    @Input()
    siteName: string;
    siteFriendlyName: string;

    libykCriteria: { t: string, q: string };

    nyaaCriteria: { f: number, c: string, q: string };

    itemList: { title: string, eps_no: number }[];

    availableTable = ['yyets', 'tokyo', 'dmhy', 'fixsub'];
    availableTableName = {'yyets': '人人影视', 'tokyo': 'Tokyo BT', 'dmhy': '动漫花园', 'fixsub': 'FIX字幕侠'};

    availableFilter = AVAILABLE_FILTER;
    availableCategory = Object.keys(AVAILABLE_CATEGORY);
    categoryMap = AVAILABLE_CATEGORY;

    keywordControl: FormControl;

    isSearching: boolean;
    noResultFound: boolean;

    constructor(private _feedService: FeedService,
                private _dialogRef: UIDialogRef<KeywordBuilder>,
                toast: UIToast) {
        this._toastRef = toast.makeText();
        this.keywordControl = new FormControl('');
    }

    selectFilter(filter: number) {
        this.nyaaCriteria.f = filter;
    }

    selectCategory(c: string) {
        this.nyaaCriteria.c = c;
    }

    selectTable(table: string) {
        this.libykCriteria.t = table;
    }

    testFeed() {
        this.isSearching = true;
        this.noResultFound = false;
        if (this.siteName === 'dmhy') {
            this._subscription.add(
                this._feedService.queryDmhy(this.keywordControl.value)
                    .subscribe((result) => {
                        this.itemList = result;
                        this.noResultFound = this.itemList.length === 0;
                        this.isSearching = false;
                    }, (error) => {
                        this.isSearching = false;
                        this._toastRef.show(error.message);
                    })
            );
        } else if (this.siteName === 'acg_rip') {
            this._subscription.add(
                this._feedService.queryAcgrip(this.keywordControl.value)
                    .subscribe((result) => {
                        this.itemList = result;
                        this.noResultFound = this.itemList.length === 0;
                        this.isSearching = false;
                    }, (error) => {
                        this.isSearching = false;
                        this._toastRef.show(error.message);
                    })
            );
        } else if (this.siteName === 'libyk_so') {
            this._subscription.add(
                this._feedService.queryLibyk_so({t: this.libykCriteria.t, q: this.keywordControl.value})
                    .subscribe((result) => {
                        this.itemList = result;
                        this.noResultFound = this.itemList.length === 0;
                        this.isSearching = false;
                    }, (error) => {
                        this.isSearching = false;
                        this._toastRef.show(error.message);
                    })
            );
        } else if (this.siteName === 'nyaa') {
            let params = new URLSearchParams();
            params.set('f', this.nyaaCriteria.f + '');
            params.set('c', this.nyaaCriteria.c);
            params.set('q', this.keywordControl.value);
            this._subscription.add(
                this._feedService.queryNyaa(params.toString())
                    .subscribe((result) => {
                        this.itemList = result;
                        this.noResultFound = this.itemList.length === 0;
                        this.isSearching = false;
                    }, (error) => {
                        this.isSearching = false;
                        this._toastRef.show(error.message);
                    })
            );
        }
    }

    cancel() {
        this._dialogRef.close(null);
    }

    save() {
        let keywordModel = this.keywordControl.value;
        let result;
        if (this.siteName === 'libyk_so') {
            if (keywordModel) {
                result = JSON.stringify({t: this.libykCriteria.t, q: keywordModel});
            } else {
                result = null;
            }
        } else if (this.siteName === 'nyaa') {
            if (keywordModel) {
                let params = new URLSearchParams();
                params.set('f', this.nyaaCriteria.f + '');
                params.set('c', this.nyaaCriteria.c);
                params.set('q', keywordModel);
                result = params.toString();
            } else {
                result = null;
            }
        } else {
            if (keywordModel) {
                result = keywordModel;
            } else {
                result = null;
            }

        }
        this._dialogRef.close({keyword: result});
    }

    ngOnInit(): void {
        if (this.siteName === 'libyk_so') {
            this.siteFriendlyName = 'LibYK';
            if (this.keyword) {
                this.libykCriteria = JSON.parse(this.keyword);
                this.keywordControl.patchValue(this.libykCriteria.q);
            } else {
                this.libykCriteria = {
                    t: this.availableTable[0],
                    q: ''
                };
            }
        } else if (this.siteName === 'nyaa') {
            this.siteFriendlyName = 'NyaaV2';
            if (this.keyword) {
                let params = new URLSearchParams(this.keyword);
                this.nyaaCriteria = {
                    f: parseInt(params.get('f'), 10),
                    c: params.get('c'),
                    q: params.get('q')
                };
                this.keywordControl.patchValue(this.nyaaCriteria.q);
            } else {
                this.nyaaCriteria = {
                    f: 0,
                    c: '1_4',
                    q: ''
                };
            }
        } else {
            if (this.siteName === 'dmhy') {
                this.siteFriendlyName = '动漫花园';
            }
            if (this.siteName === 'acg_rip') {
                this.siteFriendlyName = 'ACG.RIP';
            }
            this.keywordControl.patchValue(this.keyword);
        }
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }
}
