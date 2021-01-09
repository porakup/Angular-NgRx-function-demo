import { createSelector } from '@ngrx/store';

import { AppState } from '../../app/app.state';
import { AuthState } from '../states/auth.state';

const authState = (state: AppState) => state.auth;

export const getUserId = createSelector(authState, (state: AuthState) => state.userId);

export const getUsername = createSelector(authState, (state: AuthState) => state.username);

export const getProfile = createSelector(authState, (state: AuthState) => state.profile);

export const getAccessToken = createSelector(authState, (state: AuthState) => state.accessToken);

export const getisLoggedIn = createSelector(authState, (state: AuthState) => state.isLoggedIn);