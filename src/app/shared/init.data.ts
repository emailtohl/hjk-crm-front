/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
import { Injectable } from '@angular/core';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Csrf, Group, Principal } from './dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class InitData {
    public static headers = {
        // 跨域携带cookie，在httpBasic下抑制浏览器弹出登录窗口
        'X-Requested-With': 'XMLHttpRequest',
    };
    public static principal: Principal;
    public static token: string;

    private static csrf: Csrf;
    private static groups: Group[];

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

    load(): Promise<any> {
        return new Promise((resolve, reject) => {
            zip(
                this.http.get<Csrf>(`${environment.SERVER_URL}/csrf`),
                this.http.get<Group[]>(`${environment.SERVER_URL}/groups`),
                this.http.get<string>(`${environment.SERVER_URL}/token`)
            )
            // RxJS6的写法，原先是：ob$.map(...).catch(...).subscribe()，现在是ob$.pipe(map(...), catchError(...)).subscribe()
            .pipe(
                catchError(([csrf, groups, token]) => {
                    reject(null);
                    return [csrf, groups, token];
                }
            ))
            .subscribe(([csrf, groups, token]) => {
                InitData.csrf = csrf;
                InitData.groups = groups;
                InitData.token = token;
                // 设置请求头csrf
                InitData.headers[csrf.headerName] = csrf.token;
                InitData.headers['X-Auth-Token'] = token;
            }, () => { }, () => resolve(null))
            ;
        });
    }

}

