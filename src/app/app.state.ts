// import { RouterReducerState } from '@ngrx/router-store';

import { AuthState, initialAuthState } from 'src/store/states/auth.state';
import { SearchState, initialSearchState } from 'src/store/states/search.state';
import { RequestState, initialRequestState } from 'src/store/states/request.state';


export interface AppState {
  // router?: RouterReducerState;
  auth: AuthState;
  search: SearchState;
  request: RequestState;
}

export const initialAppState: AppState = {
  auth: initialAuthState,
  search: initialSearchState,
  request: initialRequestState
}

export function getInitialAppState(): AppState {
  return initialAppState;
}
