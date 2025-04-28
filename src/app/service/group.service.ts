import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { GroupEntity } from '../model/group-entity';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = environment.BASE_API + '/group';
  private cache$: BehaviorSubject<GroupEntity[] | null> = new BehaviorSubject<GroupEntity[] | null>(null);

  constructor(private http: HttpClient, private authService: AuthService) {}

  list(userId: string, token: string, limit: number = 10, usingCache: boolean = true): Observable<GroupEntity[]> {
    const cachedData = this.cache$.value;
    if (cachedData && usingCache) {
      return of(cachedData);
    }

    const url = `${this.apiUrl}/list`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('userId', userId).set('limit', limit.toString());

    return this.http.get<GroupEntity[]>(url, { headers, params }).pipe(
      tap(data => this.cache$.next(data)),
      catchError(error => {
        console.error("Error fetching groups:", error);
        this.authService.logOutConfig("This session expired", "", 'warning', 'yellow', "Accept", undefined, () => location.reload());
        return of([]);
      })
    );
  }

  getById(id: string, token: string): Observable<GroupEntity> {
    const url = `${this.apiUrl}/byId/${id}`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<GroupEntity>(url, { headers });

  }

  setValuesPerField(userId: string, field: string, token: string): Observable<string[]> {
    const url = `${this.apiUrl}/setValuesPerField/${field}`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('userId', userId);

    return this.http.get<string[]>(url, { headers, params });
  }

  create(userId: string, token: string, data: Partial<GroupEntity>): Observable<any> {
    const url = `${this.apiUrl}/create`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('userId', userId);

    return this.http.post(url, data, { headers, params });
  }

  update(userId: string, id: string, token: string, data: Partial<GroupEntity>): Observable<any> {
    const url = `${this.apiUrl}/update/${id}`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('userId', userId);

    return this.http.put(url, data, { headers, params });
  }

  addMember(userId: string, groupId: string, token: string): Observable<any> {
    const url = `${this.apiUrl}/addMember/${groupId}`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('userId', userId);

    return this.http.put(url, {}, { headers, params });
  }

  delete(userId: string, id: string, token: string): Observable<any> {
    const url = `${this.apiUrl}/delete/${id}`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('userId', userId);

    return this.http.delete(url, { headers, params });
  }
}
