import { createAction, props } from '@ngrx/store';

export const AddRequestAction = createAction('[Request] Add Request');

export const ClearRequestAction = createAction('[Request] Clear Request');

export const SetMessageAction = createAction('[Request] Set Message',props<{message: string}>());

export const ClearMessageAction = createAction('[Request] Clear Message');

export const SetLoginMessageAction = createAction('[Request] Set Login Message',props<{message: string}>());

export const ClearLoginMessageAction = createAction('[Request] Clear Login Message');



  

