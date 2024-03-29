/*
 * Angular 2 decorators and services
 */
import {Component, ViewEncapsulation} from '@angular/core';

import {AnalyticsService} from './analytics.service';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';

/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    template: `
        <router-outlet>
        </router-outlet>
    `,
    encapsulation: ViewEncapsulation.None
})
export class App {

    private routeEventsSubscription: Subscription;

    private removePreLoader() {
        if (document) {
            let $body = document.body;
            let preloader = document.getElementById('preloader');
            if (preloader) {
                $body.removeChild(preloader);
                this.routeEventsSubscription.unsubscribe();
            }
            $body.classList.remove('loading');
        }
    }

    constructor(analyticsSerivce: AnalyticsService, router: Router) {
        this.routeEventsSubscription = router.events
            .subscribe(
                (event) => {
                    if (event instanceof NavigationEnd) {
                        this.removePreLoader();
                        // Console banner
                        console.log(
                            '%c Altair %c Initialization completed. ',
                            'color: #fff; margin: 1em 0; padding: 5px 0; background: #3498db;',
                            'margin: 1em 0; padding: 5px 0; background: #efefef;'
                        );
                    }
                }
            );
    }
}
