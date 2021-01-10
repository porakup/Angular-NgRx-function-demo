import { initialRequestState, RequestState } from '../states/request.state';
import * as RequestAction from '../actions/request.action';
import { Action, createReducer, on } from '@ngrx/store';
import { state } from '@angular/animations';


const _requestReducer = createReducer(initialRequestState,
      on(
          RequestAction.AddRequestAction,
          (state) => {
                      let req = state.request;
                      req++;
                      return {
                        ...state,
                        request: req
                      };                
                    }
        ),
        on(
            RequestAction.ClearRequestAction,
            (state) => ({
                    ...state,
                    request: 0
                })
          ),
          on(
            RequestAction.SetMessageAction,
            (state, action) => ({
                    ...state,
                    message: action.message
                })
          ),
          on(
            RequestAction.ClearMessageAction,
            (state) => ({
                    ...state,
                    message: null
                })
          ),
          on(
            RequestAction.SetLoginMessageAction,
            (state, action) => ({
                    ...state,
                    loginMessage: action.message
                })
          ),
          on(
            RequestAction.ClearLoginMessageAction,
            (state) => ({
                    ...state,
                    loginMessage: null
                })
          )
      );

export default function requestReducer(state: RequestState, action: Action) {
      return _requestReducer(state, action);
    }