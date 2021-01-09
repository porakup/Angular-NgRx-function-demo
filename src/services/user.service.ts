import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {AppConstant as APP} from '../app/app.constant';
import User from '../models/user.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app/app.state';
import * as RequestAction from '../store/actions/request.action';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  public getUser(username: string): Observable<User> {
    this.store.dispatch(new RequestAction.AddRequestAction());
    return this.http.get<User>(APP.BASE_URL+`/api/user/${username}`)
  }

  public getFollowStatus(request: any): Observable<any> {
    return this.http.post<any>(APP.BASE_URL+'/api/followStatus', request)
  }

  public follow(request: any): Observable<any> {
    return this.http.put<any>(APP.BASE_URL+'/api/follow', request)
  }


}
