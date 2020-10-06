import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';


@Component({
    selector: 'developers',
    templateUrl: './developers.html'
})
export class DevelopersComponent {

  siteName: string = SITE_TITLE;

  constructor(titleService: Title) {
    titleService.setTitle(`开发者 - ${this.siteName}`);
  }

}
