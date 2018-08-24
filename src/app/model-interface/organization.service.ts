import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Organization } from './entities';
import { Paging } from '../shared/paging';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private httpClient: HttpClient) { }

  public search(param: {query: string, pageNumber: number}): Observable<Paging<Organization>> {
    const params: HttpParams = new HttpParams().set('query', param.query).set('pageNumber', `${param.pageNumber}`);
    return this.httpClient.get<Paging<Organization>>(`${environment.SERVER_URL}/organization/search`, { params: params });
  }

  public isTaxNumberExist(taxNumber: string): Observable<boolean> {
    const params: HttpParams = new HttpParams().set('taxNumber', taxNumber);
    return this.httpClient.get<boolean>(`${environment.SERVER_URL}/organization/isTaxNumberExist`, { params: params });
  }

  public isAccountExist(account: string): Observable<boolean> {
    const params: HttpParams = new HttpParams().set('account', account);
    return this.httpClient.get<boolean>(`${environment.SERVER_URL}/organization/isAccountExist`, { params: params });
  }

  public create(organization: Organization): Observable<Organization> {
    return this.httpClient.post<Organization>(`${environment.SERVER_URL}/organization`, organization);
  }

  public update(id: number, organization: Organization): Observable<Organization> {
    return this.httpClient.put<Organization>(`${environment.SERVER_URL}/organization/${id}`, organization);
  }

  public myRegisterOrganization(): Observable<Array<Organization>> {
    return this.httpClient.get<Array<Organization>>(`${environment.SERVER_URL}/organization/myRegisterOrganizations`);
  }

  public getMyRelationshipOrganizations(): Observable<Array<Organization>> {
    return this.httpClient.get<Array<Organization>>(`${environment.SERVER_URL}/organization/myRelationshipOrganizations`);
  }

  public createRelationship(organizationId: number, stakeholderIds: Array<number>): Observable<void> {
    return this.httpClient.post<void>(`${environment.SERVER_URL}/organization/relationship`,
      { organizationId: organizationId, stakeholderIds: stakeholderIds });
  }

  public delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.SERVER_URL}/organization/${id}`);
  }

  public deleteFile(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.SERVER_URL}/files/${id}`);
  }

  public getDetail(id: number): Observable<Organization> {
    return this.httpClient.get<Organization>(`${environment.SERVER_URL}/organization/${id}`);
  }

  public getOrganization(businessKey: string): Observable<Organization> {
    return this.httpClient.get<Organization>(`${environment.SERVER_URL}/organization/${businessKey}`);
  }

  public claim(taskId: string | number): Observable<Organization> {
    return this.httpClient.post<Organization>(`${environment.SERVER_URL}/organization/claim`, {taskId: taskId});
  }

  public check(taskId: string | number, checkApproved: boolean, checkComment: string = ''): Observable<void> {
    return this.httpClient.post<void>(`${environment.SERVER_URL}/organization/check`,
      {taskId: taskId, checkApproved: checkApproved, checkComment: checkComment});
  }
}
