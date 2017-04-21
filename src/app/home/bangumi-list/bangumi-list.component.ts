import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {HomeChild, HomeService} from "../home.service";
import {Bangumi} from "../../entity/bangumi";
import {Observable, Subscription} from "rxjs/Rx";
import {ActivatedRoute} from '@angular/router';
import {FAVORITE_LABEL} from '../../entity/constants';


@Component({
    selector: 'bangumi-list',
    templateUrl: './bangumi-list.html',
    styleUrls: ['./bangumi-list.less']
})
export class BangumiList extends HomeChild implements OnInit, OnDestroy {

    FAVORITE_LABEL = FAVORITE_LABEL;

    page: number = 0;
    total: number;
    countPerPage: number = 10;

    name: string;

    isLoading: boolean = false;

    orderBy: string = 'air_date';

    bangumiList: Bangumi[] = [];

    private routeParamsSubscription: Subscription;
    private scrollSubscription: Subscription;

    @ViewChild('loadMore') loadMoreButtonRef: ElementRef;

    constructor(homeService: HomeService, private route: ActivatedRoute) {
        super(homeService);
    }

    loadMoreContent(refresh?: boolean) {
        if (!refresh && this.page >= Math.ceil(this.total / this.countPerPage)) {
            return;
        }
        this.page++;
        this.isLoading = true;
        this.homeService.listBangumi(this.page, this.orderBy, this.name)
            .subscribe(
                (result: any) => {
                    if (refresh) {
                        this.bangumiList = result.data;
                    } else {
                        this.bangumiList = this.bangumiList.concat(result.data);
                    }
                    this.total = result.total;
                },
                (error) => {
                    console.log(error)
                },
                () => {
                    this.isLoading = false;
                }
            );
    }

    ngOnInit(): any {

        this.routeParamsSubscription = this.route.params
            .subscribe((params) => {
                // let pageFromParams = parseInt(params['page']);
                // this.page = Number.isNaN(pageFromParams) ? 0: pageFromParams;
                this.page = 0;
                this.name = params['name'];
                console.log(this.name);
                this.loadMoreContent(true);
            });

        this.scrollSubscription = Observable.fromEvent(document, 'scroll')
            .filter(() => {
                return !this.isLoading && this.page < Math.ceil(this.total / this.countPerPage);
            })
            .debounceTime(100)
            .subscribe(
                () => {
                    let viewportHeight = window.innerHeight;
                    let rect = this.loadMoreButtonRef.nativeElement.getBoundingClientRect();
                    if (rect.bottom < viewportHeight) {
                        this.loadMoreContent();
                    }
                }
            );

        return null;
    }


    ngOnDestroy(): any {
        if (this.routeParamsSubscription) {
            this.routeParamsSubscription.unsubscribe();
        }
        if (this.scrollSubscription) {
            this.scrollSubscription.unsubscribe();
        }
        return null;
    }
}
