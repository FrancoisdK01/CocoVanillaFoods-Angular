import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Wine } from 'src/app/Model/wine';
import { firstValueFrom, map } from 'rxjs';
import { HttpResponse } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class WineService {
  private headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/Wines`;

  constructor(private http: HttpClient) {}

  private setHeaders() {
    this.headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    // Retrieve the token from localStorage
    let token = localStorage.getItem('Token');
    if (token) {  
      token = JSON.parse(token);
        this.headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }
  }

  // wine crud operations ----------------------------------------------------.>
  async getWines(): Promise<Wine[]> {
    this.setHeaders();
    return firstValueFrom(this.http.get<Wine[]>(`${this.apiUrl}/CustomerWines`, {headers: this.headers}));
  }

  async getWine(id: number): Promise<Wine> {
    this.setHeaders();
    return firstValueFrom(this.http.get<Wine>(`${this.apiUrl}/${id}`, {headers: this.headers}));
  }

  async addWine(wine: FormData): Promise<Wine> {
    this.setHeaders();
    const response = await this.http.post<HttpEvent<Wine>>(this.apiUrl, wine, { reportProgress: true, observe: 'events', headers: this.headers }).toPromise();
    
    if (response instanceof HttpResponse) {
      const event = response as unknown as HttpEvent<Wine>;
      if (event.type === HttpEventType.Response) {
        return event.body as Wine;
      }
    }
    
    throw new Error('An error occurred while adding the wine.');
  }
  
  async updateWine(id: number, wine: FormData): Promise<any> {
    this.setHeaders();
    console.log('Updating wine with ID:', id, 'and data:', wine);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, wine, { reportProgress: true, observe: 'events', headers: this.headers }));
  }

  async deleteWine(id: number): Promise<any> {
    this.setHeaders();
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`, {headers: this.headers}));
  }

  purchaseWine(wineID: number): Promise<any> {
    this.setHeaders();
    const url = `${this.apiUrl}/purchase/${wineID}`;
    return firstValueFrom(this.http.post<any>(url, {}, {headers: this.headers}));
  }
}


  