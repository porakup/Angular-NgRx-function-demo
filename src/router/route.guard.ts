import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { AppState } from '../app/app.state';
import { getUsername, getisLoggedIn } from '../store/getters/auth.getter';
import { Subscription } from 'rxjs';

  @Injectable({ providedIn: 'root' })
  export class RouteGuard implements CanActivate, OnDestroy {

    private sub1: Subscription;
    private sub2: Subscription;
    private isLoggedIn: boolean = false;
    private username: string = '';

    constructor(private router: Router, private store: Store<AppState>) {}
  
    canActivate(route: ActivatedRouteSnapshot): boolean {

        let auth = route.data.auth;

        this.sub1 = this.store.pipe(select(getisLoggedIn)).subscribe(resp => {
          this.isLoggedIn = resp;
        });

        if (this.isLoggedIn) {

          if(auth){
            this.sub2 = this.store.pipe(select(getUsername)).subscribe(resp => {
              this.username = resp;
            });
            this.router.navigateByUrl(`/user/${this.username}`);
            return false
          }else {
            return true;
          }
          
        }

        if(!auth){
        this.router.navigateByUrl('/login');
        return false;
        }else {
          // for login
          return true
        }

    }

    ngOnDestroy() {
      if(this.sub1) this.sub1.unsubscribe();
      if(this.sub2) this.sub2.unsubscribe();
    }
  }
  