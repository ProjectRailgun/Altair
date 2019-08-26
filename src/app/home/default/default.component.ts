import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
// import {Episode} from "../../entity/episode";
import {HomeService, HomeChild} from "../home.service";
import {Bangumi} from "../../entity/bangumi";
import {FAVORITE_LABEL} from '../../entity/constants';
import { Subscription } from 'rxjs';
import { Announce } from '../../entity/announce';
import { PersistStorage } from '../../user-service/persist-storage';
import { SwiperConfigInterface, SwiperComponent } from 'ngx-swiper-wrapper';

const BANGUMI_TYPE_KEY = 'default_bangumi_type';
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
    autoplay: {
        delay: 5000,
    },
    direction: 'horizontal',
    slidesPerView: 1,
    scrollbar: false,
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
    },
    loop: true
};

@Component({
    selector: 'default-component',
    templateUrl: './default.html',
    styleUrls: ['./default.less']
})
export class DefaultComponent extends HomeChild implements OnInit, OnDestroy {
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
        this.bangumiType = type;
        this._persistStorage.setItem(BANGUMI_TYPE_KEY, `${type}`);
        this.getOnAir();
    }

    getOnAir() {
        this._subscription.add(
            this.homeService.onAir(this.bangumiType)
                .subscribe(
                    (bangumiList: Bangumi[]) => {
                        this.onAirBangumi = bangumiList;
                    },
                    error => console.log(error)
                )
        );
    }

    onSwiperHover( hover: boolean ) {
        if ( hover ) {
            this.Swiper.directiveRef.stopAutoplay();
        } else {
            this.Swiper.directiveRef.startAutoplay();
        }
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

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }
}
