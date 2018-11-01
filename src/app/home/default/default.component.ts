import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
// import {Episode} from "../../entity/episode";
import { HomeService, HomeChild } from '../home.service';
import { Bangumi } from '../../entity/bangumi';
import { FAVORITE_LABEL } from '../../entity/constants';
import { Subscription } from 'rxjs/Subscription';
import { Announce } from '../../entity/announce';
import { PersistStorage } from '../../user-service/persist-storage';
import { SwiperConfigInterface, SwiperComponent } from 'ngx-swiper-wrapper';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
    autoplay: 4000,
    direction: 'horizontal',
    slidesPerView: 1,
    scrollbar: false,
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
    },
    loop: true
};
const BANGUMI_TYPE_KEY = 'default_bangumi_type';

@Component({
    selector: 'default-component',
    templateUrl: './default.html',
    styleUrls: ['./default.less']
})

export class DefaultComponent extends HomeChild implements OnInit, AfterViewInit, OnDestroy {
    private _subscription = new Subscription();

    @ViewChildren('swiper')
    public Grids: QueryList<SwiperComponent>;
    private Swiper: SwiperComponent;

    // recentEpisodes: Episode[];

    isLoading = false;

    onAirBangumi: Bangumi[];

    bangumiType = 1001; // 1001 = CN; 1002 = RAW; -1 = ALL

    FAVORITE_LABEL = FAVORITE_LABEL;

    announce_in_banner: Announce[];
    announce_in_bangumi: Announce[];

    swiper_config = DEFAULT_SWIPER_CONFIG;

    constructor(homeService: HomeService, private _persistStorage: PersistStorage) {
        super(homeService);
    }

    changeBangumiType(type: number) {
        this.isLoading = true;
        this.bangumiType = type;
        this._persistStorage.setItem(BANGUMI_TYPE_KEY, `${type}`);
        this.getOnAir();
    }

    onSwiperHover( hover: boolean ) {
        if ( hover ) {
            this.Swiper.directiveRef.stopAutoplay();
        } else {
            this.Swiper.directiveRef.startAutoplay();
        }
    }
    
    getOnAir() {
        this._subscription.add(
            this.homeService.onAir(this.bangumiType)
                .subscribe(
                    (bangumiList: Bangumi[]) => {
                        this.onAirBangumi = bangumiList;
                        this.isLoading = false;
                    },
                    error => {
                        console.log(error);
                        this.isLoading = false;
                    }
                )
        );
    }

    ngOnInit(): void {
        // this.homeService.recentEpisodes()
        //   .subscribe(
        //     (episodeList: Episode[]) => {
        //       this.recentEpisodes = episodeList;
        //     },
        //     error => console.log(error)
        //   );
        let defaultBangumiType = this._persistStorage.getItem(BANGUMI_TYPE_KEY, null);
        if (defaultBangumiType !== null) {
            this.bangumiType = parseInt(defaultBangumiType, 10);
        }
        this.getOnAir();
        this._subscription.add(
            this.homeService.listAnnounce()
                .subscribe((announce_list) => {
                    this.announce_in_banner = announce_list.filter((announce) => {
                        return announce.position === Announce.POSITION_BANNER;
                    });
                    this.announce_in_bangumi = announce_list.filter(announce => {
                        return announce.position === Announce.POSITION_BANGUMI;
                    });
                })
        );
    }

    public ngAfterViewInit(): void {
        this.Grids.changes.subscribe((comps: QueryList <SwiperComponent>) => {
            this.Swiper = comps.first;
        });
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

}
