import { Pipe, PipeTransform } from '@angular/core';

export const BANGUMI_TYPES = {
    1001: '中文字幕',
    1002: 'RAW'
};

@Pipe({ name: 'bangumiTypeName' })
export class BangumiTypeNamePipe implements PipeTransform {

    transform(value: number | string): any {
        return BANGUMI_TYPES[value] || '未知类型';
    }
}
