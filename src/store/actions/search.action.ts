import { Action } from '@ngrx/store';
import { SearchState } from '../states/search.state';

export const SET_SEARCH = '[Search] Set Search';
export const CLEAR_SEARCH = '[Search] Clear Search';


export class SetSearchAction implements Action {
    readonly type = SET_SEARCH;

    constructor(public payload: SearchState) {}
}

export class ClearSearchAction implements Action {
    readonly type = CLEAR_SEARCH;
}

export type SearchAction =
  | SetSearchAction
  | ClearSearchAction

  

