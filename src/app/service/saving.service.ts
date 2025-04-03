import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { SavingsEntity } from '../model/savings-entity';


@Injectable({
  providedIn: 'root'
})
export class SavingService {
  private apiUrl = environment.BASE_API + '/saving';
  private cache$: BehaviorSubject<SavingsEntity[] | null> = new BehaviorSubject<SavingsEntity[] | null>(null);

  constructor(private http: HttpClient, private authService: AuthService) { }


  list(userId: string, token: string, limit: number = 10, usingCache: boolean = true): Observable<SavingsEntity[]> {
    const cachedData = this.cache$.value;
    if (cachedData && usingCache) {
      return of(cachedData);
    }

    let url = `${this.apiUrl}/list?userId=${userId}&limit=${limit}`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<SavingsEntity[]>(url, { headers }).pipe(
      tap(data => this.cache$.next(data)),
      catchError(error => {
        console.error("Error fetching bills:", error)
        this.authService.logOutConfig("This session expired", "", 'warning', 'yellow', "Accept", undefined, () => location.reload());
        return of([]);
      })
    );
  }

  getById(userId: string, id: string, token: string): Observable<SavingsEntity> {
      const params = new HttpParams().set('userId', userId);
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.get<SavingsEntity>(`${this.apiUrl}/byId/${id}`, { params, headers: headers });
    }


    setValuesPerField(userId: string, field: string, token: string): Observable<string[]> {
      let url = `${this.apiUrl}/setValuesPerField/${field}`;
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const params = new HttpParams()
        .set('userId', userId);

      return this.http.get<string[]>(url, { params, headers: headers });
    }

    create(userId: string, token: string, data: SavingsEntity): Observable<any> {
      const params = new HttpParams().set('userId', userId);
      const headers = { 'Authorization': `Bearer ${token}` };

      return this.http.post(`${this.apiUrl}/create`, data, { params, headers });
    }

    update(userId: string, id: string, token: string, data: SavingsEntity): Observable<any> {
      const params = new HttpParams().set('userId', userId);
      const headers = { 'Authorization': `Bearer ${token}` };

      return this.http.put(`${this.apiUrl}/update/${id}`, data, { params, headers });
    }

    delete(userId: string, id: string, token: string): Observable<any> {
      const params = new HttpParams().set('userId', userId);
      const headers = { 'Authorization': `Bearer ${token}` };
      return this.http.delete(`${this.apiUrl}/delete/${id}`, { params, headers });
    }

}
