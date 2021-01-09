import { createSelector } from '@ngrx/store';

import { AppState } from '../../app/app.state';
import { SearchState } from '../states/search.state';

const searchState = (state: AppState) => state.search;

export const getQuery = createSelector(searchState, (state: SearchState) => state.query);