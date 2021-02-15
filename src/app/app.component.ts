import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import Auth from 'src/models/auth.model';
import { AppState } from './app.state';
import * as AuthAction from '../store/actions/auth.action';
import { Subscription } from 'rxjs';
import { getRequest ,getMessage } from '../store/getters/request.getter';
import * as RequestAction from '../store/actions/request.action';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  sub1: Subscription;
  sub2: Subscription;
  isLoad: boolean = false;
  html: any;

  constructor(private router: Router,
              private store: Store<AppState>,
              private spinner: NgxSpinnerService) {
                this.html = document.getElementsByTagName("HTML")[0];
              }

  ngOnInit() {

    let user: Auth = JSON.parse(localStorage.getItem('user'));

    if(!user) {
      this.router.navigateByUrl('/login');
    }else {
      this.store.dispatch(AuthAction.CheckAuthAction(user));
    }

    this.sub1 = this.store.pipe(select(getRequest)).subscribe(request => {
      if(request > 0){
        if(!this.isLoad) {
          this.isLoad = true;
          this.spinner.show();
          this.html.setAttribute("style", "overflow-y: hidden;");
        }
      }else if(this.isLoad) {
        this.isLoad = false;
        this.spinner.hide();
        this.html.setAttribute("style", "overflow-y: scroll;");
      }
    });

    this.sub2 = this.store.pipe(select(getMessage)).subscribe(message => {
      if(message){
        Swal.fire({
          title: 'Error!',
          text: `${message}`,
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'Close',
          confirmButtonColor: 'red',
          focusConfirm: false,
          allowEnterKey: false,
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            this.store.dispatch(RequestAction.ClearMessageAction());
          }
        })
      }
    });

  }

  ngOnDestroy() {
    if(this.sub1) this.sub1.unsubscribe();
    if(this.sub2) this.sub2.unsubscribe();
  }

}
