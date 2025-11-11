import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';  // مسیر محیط پروژه
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  saveAccessToken(token: string): void {
    this.tokenService.setAccessToken(token);
  }

  getAccessToken(): string | null {
    return this.tokenService.getAccessToken();
  }

  saveRefreshToken(token: string): void {
    this.tokenService.setAccessToken(token);
  }

  refreshToken(): Observable<{ access_token: string }> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Refresh token not available');
    }

    return this.http.post<{ access_token: string }>(`${environment.baseUrl}/auth/refresh`, {
      refresh_token: refreshToken
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }


  logout(): void {
    this.tokenService.clearTokens();
  }
}
