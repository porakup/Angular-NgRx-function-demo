import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as AuthAction from '../../../store/actions/auth.action';
import * as SearchAction from '../../../store/actions/search.action';
import {AppConstant as APP} from '../../../app/app.constant';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() public username: String;
  @Input() public profile: string;
  @Input() public isLoggedIn: boolean;

  public profileUrl: string;


  constructor(private router: Router, private store: Store<AppState>) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.profileUrl = APP.BASE_URL+'/'+this.profile;
  }

  handleSearch(text: any){
    if(text) {
      this.store.dispatch(SearchAction.SetSearchAction({query: text}));
    }
  }

  gotoHome() {
    this.router.navigateByUrl(`/user/${this.username}`);
  }

  logout() {
    this.store.dispatch(AuthAction.LogoutAction());
  }

}

