import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PrincipalService {

  private apiUrl = environment.BASE_API + '/principal';
  private cache$: BehaviorSubject<{ name: string, value: number }[] | null> = new BehaviorSubject<{ name: string, value: number }[] | null>(null);

  constructor(private http: HttpClient, private authService: AuthService) { }


  accumulatedOfAll(userId: string, token: string, usingCache: boolean = true): Observable<{ name: string, value: number }[]> {
    const cachedData = this.cache$.value;
    if (cachedData && usingCache) {
      return of(cachedData);
    }

    let url = `${this.apiUrl}/accumulatedOfAll?userId=${userId}`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<{ name: string, value: number }[]>(url, { headers }).pipe(
      tap(data => this.cache$.next(data)),
      catchError(error => {
        console.error("Error fetching bills:", error)
        //this.authService.logOutConfig("This session expired", "", 'warning', 'yellow', "Accept", undefined, () => location.reload());
        return of([]);
      })
    );
  }
}
