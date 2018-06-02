/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';

import { AnalyticsService } from './analytics.service';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

require('./app.less');

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
                    }
                }
            );
    }
}
