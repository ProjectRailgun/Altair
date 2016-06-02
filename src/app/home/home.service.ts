import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {BaseService} from "../services/base.service";
import {Observable} from "rxjs/Observable";
import {Episode} from '../entity/episode';
import {Bangumi} from "../entity/bangumi";

@Injectable()
export class HomeService extends BaseService {

  private _baseUrl = '/api/home';

  constructor(
    private _http: Http
  ){
    super();
  }

  recentEpisodes(days?: number): Observable<Episode[]> {
    let queryUrl = this._baseUrl + '/recent';
    if(days) {
      queryUrl = queryUrl + '?days=' + days;
    }
    return this._http.get(queryUrl)
      .map(res => <Episode[]> res.json().data)
      .catch(this.handleError);
  }

  onAir(): Observable<Bangumi[]> {
    let queryUrl = this._baseUrl + '/on_air';
    return this._http.get(queryUrl)
      .map(res => <Bangumi[]> res.json().data)
      .catch(this.handleError);
  }

  episode_detail(episode_id: string): Observable<Episode> {
    let queryUrl = this._baseUrl + '/episode/' + episode_id;
    return this._http.get(queryUrl)
      .map(res => <Episode> res.json())
      .catch(this.handleError);
  }

  bangumi_datail(bangumi_id: string): Observable<Bangumi> {
    let queryUrl = this._baseUrl + '/bangumi/' + bangumi_id;
    return this._http.get(queryUrl)
      .map(res => <Bangumi> res.json().data)
      .catch(this.handleError);
  }
}