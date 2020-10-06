import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';


@Component({
    selector: 'tos',
    templateUrl: './tos.html'
})
export class TosComponent {

  siteName: string = SITE_TITLE;

  constructor(titleService: Title) {
    titleService.setTitle(`使用条款 - ${this.siteName}`);
  }

}
