import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import * as SearchAction from '../actions/search.action';


@Injectable()
export class SearchEffect {

  constructor(
    private actions$: Actions,
    private router: Router,
  ) {}

  search = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchAction.SetSearchAction),
      tap(() => {
        this.router.navigateByUrl('/search');
      })
    ), { dispatch: false }
  );

}
