import { Action } from '@ngrx/store';

export const ADD_REQUEST = '[Loader] Add Request';
export const CLEAR_REQUEST = '[Loader] Clear Request';
export const SET_MESSAGE = '[Loader] Set Message';
export const CLEAR_MESSAGE = '[Loader] Clear Message';
export const SET_LOGIN_MESSAGE = '[Loader] Set Login Message';
export const CLEAR_LOGIN_MESSAGE = '[Loader] Clear Login Message';


export class AddRequestAction implements Action {
    readonly type = ADD_REQUEST;
}

export class ClearRequestAction implements Action {
    readonly type = CLEAR_REQUEST;
}

export class SetMessageAction implements Action {
    readonly type = SET_MESSAGE;

    constructor(public payload: {message: string}) {}
}

export class ClearMessageAction implements Action {
    readonly type = CLEAR_MESSAGE;
}

export class SetLoginMessageAction implements Action {
    readonly type = SET_LOGIN_MESSAGE;

    constructor(public payload: {message: string}) {}
}

export class ClearLoginMessageAction implements Action {
    readonly type = CLEAR_LOGIN_MESSAGE;
}

export type RequestAction =
  | AddRequestAction
  | ClearRequestAction
  | SetMessageAction
  | ClearMessageAction
  | SetLoginMessageAction
  | ClearLoginMessageAction

  

