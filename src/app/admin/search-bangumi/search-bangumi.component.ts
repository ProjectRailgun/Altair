import {fromEvent as observableFromEvent, Subscription} from 'rxjs';

import {debounceTime, distinctUntilChanged, filter, map, mergeMap, takeWhile, tap} from 'rxjs/operators';
import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Bangumi} from '../../entity';
import {AdminService} from '../admin.service';
import {UIDialogRef, UIToast, UIToastComponent, UIToastRef} from 'altair-ui';
import {BaseError} from '../../../helpers/error/BaseError';
import {BangumiRaw} from '../../entity/bangumi-raw';

// export const SEARCH_BAR_HEIGHT = 4.8;

@Component({
    selector: 'search-bangumi',
    templateUrl: './search-bangumi.html',
    styleUrls: ['./search-bangumi.less']
})
export class SearchBangumi implements AfterViewInit {
    private _subscription = new Subscription();
    private _toastRef: UIToastRef<UIToastComponent>;

    @ViewChild('searchBox', {static: false}) searchBox: ElementRef;
    @ViewChild('typePicker', {static: false}) typePicker: ElementRef;

    name: string;
    bangumiType: number = 1001;

    currentPage: number = 1;
    total: number = 0;
    count: number = 10;

    bangumiList: Bangumi[];
    isLoading: boolean = false;

    typePickerOpen: boolean = false;

    selectedBgmId: number;

    showDetail: boolean = false;
    isSaving: boolean = false;

    constructor(private _adminService: AdminService,
                private _dialogRef: UIDialogRef<SearchBangumi>,
                toastService: UIToast) {
        this._toastRef = toastService.makeText();
    }

    ngAfterViewInit(): void {
        let searchBox = <HTMLElement>this.searchBox.nativeElement;
        let typePicker = <HTMLElement>this.typePicker.nativeElement;

        this._subscription.add(
            observableFromEvent(typePicker, 'click').pipe(
                filter(() => !this.typePickerOpen),
                tap((event: MouseEvent) => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.typePickerOpen = true;
                }),
                mergeMap(() => {
                    return observableFromEvent(document.body, 'click').pipe(
                        tap((event: MouseEvent) => {
                            event.preventDefault();
                            event.stopPropagation();
                        }),
                        takeWhile(() => this.typePickerOpen),)
                }),)
                .subscribe(
                    () => {
                        this.typePickerOpen = false;
                    }
                )
        );

        this._subscription.add(
            observableFromEvent(searchBox, 'keyup').pipe(
                debounceTime(500),
                map(() => (searchBox as HTMLInputElement).value),
                distinctUntilChanged(),
                filter(name => !!name),)
                .subscribe(
                    (name: string) => {
                        this.currentPage = 1;
                        this.name = name;
                        this.fetchData();
                    }
                )
        );
        // setTimeout(() => {
        //     let cardHeight = getRemPixel(CARD_HEIGHT_REM);
        //     let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        //     let scaleFactor = viewportHeight < 600 ? 1 : 0.8;
        //     let uiPaginationHeight = getRemPixel(1/* font-size */ + 0.92857143/* padding */ * 2 + 2 /* margin-top */);
        //     this.bangumiListHeight = Math.floor(viewportHeight * scaleFactor) - getRemPixel(SEARCH_BAR_HEIGHT) - uiPaginationHeight;
        //     this.count = Math.max(1, Math.floor((this.bangumiListHeight - uiPaginationHeight) / cardHeight));
        //     console.log(this.count);
        // });
    }

    onPageChanged(page: number) {
        this.currentPage = page;
        this.fetchData();
    }

    onTypeChanged(type: number) {
        this.bangumiType = type;
        this.fetchData();
    }

    fetchData() {
        if (!this.name) {
            return;
        }
        let offset = (this.currentPage - 1) * this.count;
        this.isLoading = true;
        this._adminService.searchBangumi({
            name: this.name,
            type: 2, // type: this.bangumiType, // Force to search subject type=2 (anime).
            offset: offset,
            count: this.count
        })
            .subscribe(
                (result: { data: Bangumi[], total: number }) => {
                    this.bangumiList = result.data;
                    this.total = result.total;
                    this.isLoading = false;
                },
                (error: BaseError) => {
                    this.bangumiList = [];
                    this._toastRef.show(error.message);
                    this.isLoading = false;
                }
            );
    }

    cancelSearch() {
        this._dialogRef.close('cancelled');
    }

    viewDetail(bangumi: Bangumi): void {
        if (bangumi.id) {
            return;
        }
        this.selectedBgmId = bangumi.bgm_id;
        this.showDetail = true;
    }

    fromDetail(bangumi: BangumiRaw): void {
        if (bangumi) {
            this.isSaving = true;
            bangumi.type = this.bangumiType; // Use user-defined bangumiType to override that from API.
            this._subscription.add(
                this._adminService.addBangumi(bangumi)
                    .subscribe(
                        (bangumi_id: string) => {
                            this._dialogRef.close(bangumi_id);
                        },
                        (error: BaseError) => {
                            this.isSaving = false;
                            this._toastRef.show(error.message);
                        }
                    )
            );
        } else {
            this.showDetail = false;
        }
    }
}
