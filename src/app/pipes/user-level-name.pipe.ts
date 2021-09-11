import {Pipe, PipeTransform} from '@angular/core';

export const LEVEL_NAMES = ['默认 0', '用户 1', '管理员 2', '超级管理员 3'];

@Pipe({name: 'userLevelName'})
export class UserLevelNamePipe implements PipeTransform {

    transform(level: number): any {
        return LEVEL_NAMES[level] || '未知';
    }
}
