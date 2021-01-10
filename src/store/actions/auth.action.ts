import { createAction, props } from '@ngrx/store';
import { AuthState } from '../states/auth.state';


export const LoginAction = createAction('[Auth] Login',props<{username: string, password: string}>());

export const SetLoginAction = createAction('[Auth] Set Login',props<AuthState>());

export const CheckAuthAction = createAction('[Auth] Check Auth',props<AuthState>());

export const SetAuthAction = createAction('[Auth] Set Auth',props<AuthState>());

export const LogoutAction = createAction('[Auth] Logout');

  

