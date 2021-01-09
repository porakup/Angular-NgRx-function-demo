import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.state';
import * as AuthAction from '../../store/actions/auth.action';
import { getLoginMessage } from '../../store/getters/request.getter';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public loginForm: FormGroup;
  public message: string = null;
  private sub: Subscription;

  constructor(private store: Store<AppState>, private title: Title) { }

  ngOnInit() {
    this.title.setTitle('Video Online');
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
    this.sub = this.store.pipe(select(getLoginMessage)).subscribe(message => {
      this.message = message;
    });
  }

  login() {

      if (!this.loginForm.valid) {
        return;
      }

      let request: any = {};
      request.username = this.loginForm.value.username;
      request.password = this.loginForm.value.password;

      this.store.dispatch(new AuthAction.LoginAction(request));
  }

  ngOnDestroy() {
    if(this.sub) this.sub.unsubscribe();
  }

}
