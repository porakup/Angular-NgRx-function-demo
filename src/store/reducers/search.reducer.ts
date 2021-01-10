import { initialSearchState, SearchState } from '../states/search.state';
import * as SearchAction from '../actions/search.action';
import { Action, createReducer, on } from '@ngrx/store';


const _searchReducer = createReducer(initialSearchState,
  on(
    SearchAction.SetSearchAction,
      (state, action) => ({
          query: action.query,
          })
    ),
    on(
      SearchAction.ClearSearchAction,
      () => ({
          query: null,
          })
    )
);

export default function searchReducer(state: SearchState, action: Action) {
  return _searchReducer(state, action);
}