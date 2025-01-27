import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { BillsEntity } from '../model/bills-entity';


@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl = environment.BASE_API + '/bills';
  private cache$: BehaviorSubject<BillsEntity[] | null> = new BehaviorSubject<BillsEntity[] | null>(null);

  constructor(private http: HttpClient) { }

  list(userId: string, limit: number = 10, token: string): Observable<BillsEntity[]> {
    const cachedData = this.cache$.value;
    if (cachedData) {
      return of(cachedData);
    }

    let url = `${this.apiUrl}/list?userId=${userId}&limit=${limit}`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<BillsEntity[]>(url, { headers }).pipe(
      tap(data => this.cache$.next(data)),
      catchError(error => {
        console.error("Error fetching bills:", error);
        return of([]);
      })
    );
  }
}
