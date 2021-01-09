import { createSelector } from '@ngrx/store';

import { AppState } from '../../app/app.state';
import { RequestState } from '../states/request.state';

const requestState = (state: AppState) => state.request;

export const getRequest = createSelector(requestState, (state: RequestState) => state.request);

export const getMessage = createSelector(requestState, (state: RequestState) => state.message);

export const getLoginMessage = createSelector(requestState, (state: RequestState) => state.loginMessage);