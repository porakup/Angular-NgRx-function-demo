import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import * as SearchAction from '../actions/search.action';


@Injectable()
export class SearchEffect {

  constructor(
    private actions$: Actions,
    private router: Router,
  ) {}

  @Effect({ dispatch: false })
  search = this.actions$.pipe(
    ofType(SearchAction.SET_SEARCH),
    tap(() => {
      this.router.navigateByUrl('/search');
    })
  );

}
