import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  getList(token:string): Observable<UserEntity[]> {
    let url = this.apiUrl + "/list";
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.httpClient.get<UserEntity[]>(`${url}`, { headers: headers });
  }

  getUsersPaged(limit: number = 10, lastDocumentId?: string): Observable<UserEntity[]> {
    let url = `${this.apiUrl}/list/paged`;
    let params: HttpParams = new HttpParams().set('limit', limit);
    if (lastDocumentId) {
      params = params.set('lastDocumentId', lastDocumentId);
    }
    return this.httpClient.get<UserEntity[]>(url, { params });
  }

  getUserById(id: string, token:string): Observable<UserEntity> {
    let url = this.apiUrl + "/byId/" + id;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.httpClient.get<UserEntity>(url,  { headers: headers });
  }

  createUser(user: UserEntity, uid:string): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/create?uid=${uid}`, user);
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
