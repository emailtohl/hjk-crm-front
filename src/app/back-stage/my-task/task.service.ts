import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient: HttpClient) { }

  public todoTasks(): Observable<Array<any>> {
    return this.httpClient.get<Array<any>>(`${environment.SERVER_URL}/flow/todoTasks`);
  }
}
