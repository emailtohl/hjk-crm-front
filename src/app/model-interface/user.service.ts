import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './entities';
import { Paging } from '../shared/paging';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  public search(param: {query: string, pageNumber: number}): Observable<Paging<User>> {
    const params: HttpParams = new HttpParams().set('query', param.query).set('pageNumber', `${param.pageNumber}`);
    return this.httpClient.get<Paging<User>>(`${environment.SERVER_URL}/users/search`, { params: params });
  }

  public delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.SERVER_URL}/users/${id}`);
  }

  public getDetail(id: number): Observable<User> {
    return this.httpClient.get<User>(`${environment.SERVER_URL}/users/${id}`);
  }

  public resetPassword(id: number): Observable<void> {
    return this.httpClient.post<void>(`${environment.SERVER_URL}/users/resetPassword`, {id: id});
  }

  public enable(id: number, enabled: boolean): Observable<void> {
    return this.httpClient.post<void>(`${environment.SERVER_URL}/users/enable`, {id: id, enabled: enabled});
  }
}
