import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { TokenService } from '@core/services/token.service';
import { AuthService } from '@core/services/auth.service';
import { ErrorHandlerService } from '@core/services/error-handler.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: any = null;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const accessToken = this.tokenService.getAccessToken();

    if (accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    return next.handle(req).pipe(
      filter((event: HttpEvent<any>) => event instanceof HttpResponse),
      map((event: HttpResponse<any>) => {
        if (event instanceof HttpResponse) {
          this.errorHandler.handleResponseError(event.body);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;

          this.refreshTokenSubject = new Observable<any>();

          return this.authService.refreshToken().pipe(
            switchMap((response: { access_token: string }) => {
              this.isRefreshing = false;
              this.tokenService.setAccessToken(response.access_token);

              this.refreshTokenSubject.next(response.access_token);

              return next.handle(req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.access_token}`
                }
              }));
            }),
            catchError(err => {
              this.isRefreshing = false;
              this.authService.logout();
              this.errorHandler.handleError(401, 'Session expired. Please log in again.');
              this.refreshTokenSubject.error(err);
              return of(err);
            })
          );
        }

        if (error.error && error.error.message) {
          this.errorHandler.handleError(error.status, error.error.message);
        } else {
          this.errorHandler.handleError(error.status, 'An unknown error occurred');
        }

        return of(error);
      })
    );
  }
}
