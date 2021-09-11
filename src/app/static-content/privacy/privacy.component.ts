import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';


@Component({
    selector: 'privacy',
    templateUrl: './privacy.html'
})
export class PrivacyComponent {

    siteName: string = SITE_TITLE;

    constructor(titleService: Title) {
        titleService.setTitle(`隐私声明 - ${this.siteName}`);
    }

}
