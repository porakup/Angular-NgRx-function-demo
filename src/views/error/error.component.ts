import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.state';

import { getUsername, getisLoggedIn } from '../../store/getters/auth.getter';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnDestroy {

  private sub1: Subscription;
  private sub2: Subscription;

  constructor(private router: Router, private store: Store<AppState>) { }

  back() {

      let isLoggedIn = false;
      let username = '';

      this.sub1 = this.store.pipe(select(getisLoggedIn)).subscribe(resp => {
        isLoggedIn = resp;
      });

      this.sub2 = this.store.pipe(select(getUsername)).subscribe(resp => {
        username = resp;
      });

      if (isLoggedIn) {
        this.router.navigateByUrl(`/user/${username}`);
      }
   
  }

  ngOnDestroy() {
    if(this.sub1) this.sub1.unsubscribe();
    if(this.sub2) this.sub2.unsubscribe();
  }

}
