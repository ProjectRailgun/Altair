import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Bangumi, BangumiRaw} from '../entity';
import {Observable} from 'rxjs/Observable';
import {Episode} from '../entity/episode';
import {queryString} from '../../helpers/url'
import {BaseService} from '../../helpers/base.service';
import {VideoFile} from '../entity/video-file';


@Injectable()
export class AdminService extends BaseService {

    private baseUrl = '/api/admin';

    constructor(private http: Http) {
        super();
    }

    queryBangumi(params: {bgmId: number, typeId: number}): Observable<BangumiRaw> {
        let queryParams = queryString(params);
        return this.http.get(`${this.baseUrl}/bangumi/query?${queryParams}`)
            .map(res => new BangumiRaw(res.json()))
            .catch(this.handleError);
    }

    searchBangumi(params: {name: string, type: number, offset: number, count: number}): Observable<{data: Bangumi[], total: number}> {
        let queryParams = queryString(params);
        return this.http.get(`${this.baseUrl}/bangumi/search?${queryParams}`)
            .map(res => <Bangumi[]> res.json())
            .catch(this.handleError);
    }

    addBangumi(bangumiRaw: BangumiRaw): Observable<string> {
        let queryUrl = this.baseUrl + '/bangumi/add';
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = JSON.stringify(bangumiRaw);
        return this.http.post(queryUrl, body, options)
            .map(res => res.json().data.id)
            .catch(this.handleError);
    }

    listBangumi(params: {
        page: number,
        count: number,
        order_by: string,
        sort: string,
        name?: string,
        type?: number}): Observable<{ data: Bangumi[], total: number }> {
        let queryParams = queryString(params);
        return this.http.get(`${this.baseUrl}/bangumi/list?${queryParams}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getBangumi(id: string): Observable<Bangumi> {
        let queryUrl = this.baseUrl + '/bangumi/entry/' + id;
        return this.http.get(queryUrl)
            .map(res => res.json().data)
            .catch(this.handleError)
    }

    updateBangumi(bangumi: Bangumi): Observable<any> {
        let id = bangumi.id;
        let queryUrl = this.baseUrl + '/bangumi/entry/' + id;
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = JSON.stringify(bangumi);
        return this.http.put(queryUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    deleteBangumi(bangumi_id: string): Observable<{delete_delay: number}> {
        return this.http.delete(`${this.baseUrl}/bangumi/entry/${bangumi_id}`)
            .map(res => res.json().data as {delete_delay: number})
            .catch(this.handleError)
    }

    addEpisode(episode: Episode): Observable<string> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = JSON.stringify(episode);
        return this.http.post(`${this.baseUrl}/episode/add`, body, options)
            .map(res => <string> res.json().data.id)
            .catch(this.handleError);
    }

    getEpisode(episode_id: string): Observable<Episode> {
        return this.http.get(`${this.baseUrl}/episode/entry/${episode_id}`)
            .map(res => <Episode> res.json().data)
            .catch(this.handleError);
    }

    updateEpisode(episode: Episode): Observable<any> {
        let id = episode.id;
        let queryUrl = this.baseUrl + '/episode/entry/' + id;
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = JSON.stringify(episode);
        return this.http.put(queryUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    deleteEpisode(episode_id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/episode/entry/${episode_id}`)
            .map(res => res.json())
            .catch(this.handleError)
    }

    updateThumbnail(episode: Episode, time: string): Observable<any> {
        let id = episode.id;
        let queryUrl = this.baseUrl + '/episode/thumbnail/' + id;
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = JSON.stringify({time: time});
        return this.http.put(queryUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    addVideoFile(videoFile: VideoFile): Observable<string> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = JSON.stringify(videoFile);
        return this.http.post(`${this.baseUrl}/video/add`, body, options)
            .map(res => res.json().data as string)
            .catch(this.handleError);
    }

    getEpisodeVideoFiles(episode_id: string): Observable<VideoFile[]> {
        return this.http.get(`${this.baseUrl}/video/list?episode_id=${episode_id}`)
            .map(res => res.json().data as VideoFile[])
            .catch(this.handleError);
    }

    deleteVideoFile(video_file_id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/video/entry/${video_file_id}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    updateVideoFile(videoFile: VideoFile): Observable<any> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = JSON.stringify(videoFile);
        return this.http.put(`${this.baseUrl}/video/entry/${videoFile.id}`, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }
}
