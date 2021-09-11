import {Bangumi} from './bangumi';

export class Announce {
    static POSITION_BANNER = 1;
    static POSITION_BANGUMI = 2;

    id?: string;
    content: string;
    bangumi?: Bangumi;
    image_url?: string;
    position: number;
    sort_order: number;
    start_time: number;
    end_time: number;
}
