/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
import { Injectable } from '@angular/core';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Csrf, Group, Principal } from './entities';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class InitData {
    public static principal: Principal;
    private static groups: Group[];

    constructor(private http: HttpClient) { }

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
            .pipe(
                catchError(([csrf, groups, token]) => {
                    reject(null);
                    return [csrf, groups, token];
                }
            ))
            .subscribe(([csrf, groups, token]) => {
                // InitData.csrf = csrf;
                InitData.groups = groups;
                // InitData.token = token;
                // 设置请求头csrf
                // InitData.headers[csrf.headerName] = csrf.token;
                // InitData.headers['X-Auth-Token'] = token;
            }, () => { }, () => resolve(null))
            ;
        });
    }

}

