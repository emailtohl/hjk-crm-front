import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Invoice } from './entities';
import { Observable } from 'rxjs';
import { Paging } from '../shared/paging';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private httpClient: HttpClient) { }

  /**
 * 发起开票流程
 * @param invoice
 * @return
 */
  public start(invoice: Invoice): Observable<Invoice> {
    return this.httpClient.post<Invoice>(`${environment.SERVER_URL}/invoice/start`, invoice);
  }

  public search(param: { query: string, pageNumber: number }): Observable<Paging<Invoice>> {
    const params: HttpParams = new HttpParams().set('query', param.query).set('pageNumber', `${param.pageNumber}`);
    return this.httpClient.get<Paging<Invoice>>(`${environment.SERVER_URL}/invoice/search`, { params: params });
  }

  public myApply(): Observable<Array<Invoice>> {
    return this.httpClient.get<Array<Invoice>>(`${environment.SERVER_URL}/invoice/myApply`);
  }

  public getDetail(id: number): Observable<Invoice> {
    return this.httpClient.get<Invoice>(`${environment.SERVER_URL}/invoice/get/${id}`);
  }

  public getByProcessInstanceId(processInstanceId: string): Observable<Invoice> {
    return this.httpClient.get<Invoice>(`${environment.SERVER_URL}/invoice/processInstanceId/${processInstanceId}`);
  }

  public claim(taskId: string | number): Observable<Invoice> {
    const params: HttpParams = new HttpParams().set('taskId', `${taskId}`);
    return this.httpClient.post<Invoice>(`${environment.SERVER_URL}/invoice/claim`, null, { params: params });
  }

  public check(taskId: string, checkApproved: boolean, invoice: any): Observable<void> {
    const params: HttpParams = new HttpParams().set('taskId', taskId).set('checkApproved', `${checkApproved}`);
    return this.httpClient.post<void>(`${environment.SERVER_URL}/invoice/check`, invoice, {params: params});
  }
}
