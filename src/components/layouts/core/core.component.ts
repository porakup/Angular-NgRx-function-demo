import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, Event, NavigationStart } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.state';
import * as SearchAction from '../../../store/actions/search.action';

import { getUsername, getisLoggedIn, getProfile } from '../../../store/getters/auth.getter';
import { getQuery } from '../../../store/getters/search.getter';


@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent implements OnInit, OnDestroy {

  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;
  private sub4: Subscription;
  private sub5: Subscription;
  private query: string;
  public username: String;
  public profile: string;
  public isLoggedIn: boolean;

  constructor(private store: Store<AppState>,
              private router: Router
             ) { }

  ngOnInit() {

    this.sub1 = this.store.pipe(select(getQuery)).subscribe(resp => {
      this.query = resp;
    });

    this.sub2 = this.router.events
    .subscribe(
      (event: Event) => {
        if(event instanceof NavigationStart) {
          if(this.query && event.url !== '/search'){
            this.store.dispatch(SearchAction.ClearSearchAction());
          }
        }
      });

    this.sub3 = this.store.pipe(select(getUsername)).subscribe(resp => {
      this.username = resp;
    });

    this.sub4 = this.store.pipe(select(getProfile)).subscribe(resp => {
      this.profile = resp;
    });

    this.sub5 = this.store.pipe(select(getisLoggedIn)).subscribe(resp => {
      this.isLoggedIn = resp;
    });
  }


  ngOnDestroy() {
    if(this.sub1) this.sub1.unsubscribe();
    if(this.sub2) this.sub2.unsubscribe();
    if(this.sub3) this.sub3.unsubscribe(); 
    if(this.sub4) this.sub4.unsubscribe(); 
    if(this.sub5) this.sub4.unsubscribe(); 
  }

}
