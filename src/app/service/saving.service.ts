import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SavingService {
  private apiUrl = environment.BASE_API+'/saving'; 

  constructor(private http: HttpClient) {}

  createSaving(userId: string, savingData: any): Observable<any> {
    const params = new HttpParams().set('userId', userId);
    return this.http.post(`${this.apiUrl}/create`, savingData, { params });
  }

  listSavings(userId: string, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('limit', limit.toString());
    return this.http.get(`${this.apiUrl}/list`, { params });
  }

  getSavingById(userId: string, id: string): Observable<any> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get(`${this.apiUrl}/byId/${id}`, { params });
  }

  updateSaving(userId: string, id: string, savingData: any): Observable<any> {
    const params = new HttpParams().set('userId', userId);
    return this.http.put(`${this.apiUrl}/update/${id}`, savingData, { params });
  }

  deleteSaving(userId: string, id: string): Observable<any> {
    const params = new HttpParams().set('userId', userId);
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { params });
  }
}
