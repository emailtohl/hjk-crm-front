import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private httpClient: HttpClient) { }

  public isTaxNumberExist(taxNumber: string): Observable<boolean> {
    const params: HttpParams = new HttpParams().set('taxNumber', taxNumber);
    return this.httpClient.get<boolean>(`${environment.SERVER_URL}/organization/isTaxNumberExist`, { params: params });
  }

  public isAccountExist(account: string): Observable<boolean> {
    const params: HttpParams = new HttpParams().set('account', account);
    return this.httpClient.get<boolean>(`${environment.SERVER_URL}/organization/isAccountExist`, { params: params });
  }

  public create(organization): Observable<any> {
    return this.httpClient.post(`${environment.SERVER_URL}/organization`, organization);
  }
}
