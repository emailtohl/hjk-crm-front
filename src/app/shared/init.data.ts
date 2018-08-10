/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
import { Injectable } from '@angular/core';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Config } from '../config';
import { Csrf, Group } from './dto';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class InitData {
    public static headers = {
        // 跨域携带cookie，在httpBasic下抑制浏览器弹出登录窗口
        'X-Requested-With': 'XMLHttpRequest',
    };
    private static csrf: Csrf;
    private static groups: Group[];
    private static token: string;
    // 用老式的http，避免与HttpClient循环引用
    constructor(private http: HttpClient) { }

    public static getCsrf(): Csrf {
        const csrf = new Csrf();
        csrf.headerName = InitData.csrf.headerName;
        csrf.parameterName = InitData.csrf.parameterName;
        csrf.token = InitData.csrf.token;
        return csrf;
    }

    public static getGroups(): Group[] {
        return InitData.groups.map(g => {
            const group: Group = new Group();
            group.id = g.id;
            group.name = g.name;
            group.type = g.type;
            return group;
        });
    }

    public static getToken(): string {
        return InitData.token;
    }

    load(): Promise<any> {
        return new Promise((resolve, reject) => {
            zip(
                this.http.get<Csrf>(`${Config.backend}/csrf`),
                this.http.get<Group[]>(`${Config.backend}/groups`),
                this.http.get<string>(`${Config.backend}/token`)
            )
            // RxJS6的写法，原先是：ob$.map(...).catch(...).subscribe()，现在是ob$.pipe(map(...), catchError(...)).subscribe()
            .pipe(catchError(([csrf, groups, token]) => {
                reject(true);
                return [csrf, groups, token];
            }))
            .subscribe(([csrf, groups, token]) => {
                InitData.csrf = csrf;
                InitData.groups = groups;
                InitData.token = token;
                // 设置请求头csrf
                InitData.headers[csrf.headerName] = csrf.token;
                resolve(true);
            })
            ;
        });
    }

}

