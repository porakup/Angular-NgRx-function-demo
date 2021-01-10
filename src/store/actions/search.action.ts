import { createAction, props } from '@ngrx/store';
import { SearchState } from '../states/search.state';


export const SetSearchAction = createAction('[Search] Set Search',props<SearchState>());

export const ClearSearchAction = createAction('[Search] Clear Search');



  

