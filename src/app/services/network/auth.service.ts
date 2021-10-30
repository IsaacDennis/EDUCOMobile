import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import external from "external.config.json";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = external.serverUrl + '/sessions';
  constructor(private http: HttpClient) { }
  authenticateUser(email: string, password: string): Observable<string>{
    return this.http.post<string>(this.baseUrl, { email, password });
  }
}
