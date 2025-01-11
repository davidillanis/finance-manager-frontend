import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserEntity } from '../model/user-entity';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl:string = environment.BASE_API+"/user";


  constructor(private httpClient: HttpClient) { }

  getList(): Observable<UserEntity[]> {
    let url = this.apiUrl + "/list";
    return this.httpClient.get<UserEntity[]>(`${url}`);
  }

  getUsersPaged(limit: number = 10, lastDocumentId?: string): Observable<UserEntity[]> {
    let url = `${this.apiUrl}/list/paged`;
    let params: HttpParams = new HttpParams().set('limit', limit);
    if (lastDocumentId) {
      params = params.set('lastDocumentId', lastDocumentId); 
    }
    return this.httpClient.get<UserEntity[]>(url, { params });
  }

  getUserById(id: string): Observable<UserEntity> {
    let url = this.apiUrl + "byId/" + id;
    return this.httpClient.get<UserEntity>(url);
  }

  createUser(user: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/create`, user);
  }

  updateUser(user: any): Observable<any> {
    let url = this.apiUrl + "/update";
    return this.httpClient.put<any>(url, user);
  }

  deleteUser(id: string): Observable<any> {
    let url = this.apiUrl + "/delete/" + id;
    return this.httpClient.delete<any>(url);
  }
}
