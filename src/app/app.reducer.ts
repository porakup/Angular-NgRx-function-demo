// import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import AuthReducer from '../store/reducers/auth.reducer';
import SearchReducer from '../store/reducers/search.reducer';
import RequestReducer from '../store/reducers/request.reducer';
import { AppState } from './app.state';

export const appReducer: ActionReducerMap<AppState> = {
  // router: routerReducer,
    auth: AuthReducer,
    search: SearchReducer,
    request: RequestReducer
  };

