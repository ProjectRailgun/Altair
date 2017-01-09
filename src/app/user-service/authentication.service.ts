import {Injectable} from "@angular/core";
import {UserService} from "./user.service";
import {User} from "../entity";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {AuthError} from '../../helpers/error/AuthError';


@Injectable()
export class Authentication implements CanActivate {

  user: User;

  constructor(private userService: UserService, private router: Router) {
  }

  public invalidateUser(): void {
    this.user = null;
  }

  /**
   * @deprecated
   */
  public isAuthenticated(): Promise<User | Error> {
    return new Promise((resolve, reject) => {
      if (this.user) {
        resolve(this.user);
      } else {
        this.userService.getUserInfo()
          .subscribe(
            (user: User) => {
              this.user = user;
              resolve(user);
            },
            (error: any) => {
              reject(error);
            }
          )
      }
    });
  }

  private getUserInfo(): Observable<User> {
    if (this.user) {
      return Observable.of(this.user);
    } else {
      return this.userService.getUserInfo()
        .map((user: User) => {
          this.user = user;
          return user;
        })
    }
  }

  private hasPermission(route: ActivatedRouteSnapshot): boolean {
    if (route.data && typeof route.data['level'] !== 'undefined') {
      return this.user.level >= route.data['level'];
    } else {
      return true;
    }

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
    let sourceUrl = state.url;
    return this.getUserInfo()
      .map(() => {
        if (this.hasPermission(route)) {
          return true;
        } else {
          this.router.navigate(['/error', {message: AuthError.PERMISSION_DENIED, status: 403}]);
          return false;
        }
      })
      .catch((error) => {
        console.log(error, `Is AuthError: ${error instanceof AuthError}`);
        if(error instanceof AuthError) {
          if(sourceUrl === '/') {
            this.router.navigate(['/login']);
          } else {
            this.router.navigate(['/login', {sourceUrl: sourceUrl}]);
          }
        } else {
          this.router.navigate(['/error', {message: error.message, status: error.status}]);
        }
        return Observable.of(false);
      });
  }
}
