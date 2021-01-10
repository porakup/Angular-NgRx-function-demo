import { AuthState, initialAuthState } from '../states/auth.state';
import * as AuthAction from '../actions/auth.action';
import { Action, createReducer, on } from '@ngrx/store';

const _authReducer = createReducer(initialAuthState,
    on(
        AuthAction.SetLoginAction,
        AuthAction.SetAuthAction,
        (state, action) => ({
            userId: action.userId,
            username: action.username,
            profile: action.profile,
            accessToken: action.accessToken,
            isLoggedIn: action.isLoggedIn
            })
      ),
      on(
        AuthAction.LogoutAction,
        () => ({
            userId: null,
            username: null,
            profile: null,
            accessToken: null,
            isLoggedIn: null
            })
      )
);

export default function authReducer(state: AuthState, action: Action) {
    return _authReducer(state, action);
  }