import { initialRequestState } from '../states/request.state';
import * as RequestAction from '../actions/request.action';


export default function loaderReducer(
    state = initialRequestState,
    action: RequestAction.RequestAction
  ) {
    switch (action.type) {  
        case RequestAction.ADD_REQUEST:
              let req = state.request;
              req++
              return {
                  ...state,
                  request: req
              };     
        case RequestAction.CLEAR_REQUEST:
              return {
                ...state,
                request: 0
              };
        case RequestAction.SET_MESSAGE:
              return {
                 ...state,
                  message: action.payload.message
              };     
        case RequestAction.CLEAR_MESSAGE:
              return {
                ...state,
                message: null
              };
        case RequestAction.SET_LOGIN_MESSAGE:
              return {
                 ...state,
                  loginMessage: action.payload.message
              };     
        case RequestAction.CLEAR_LOGIN_MESSAGE:
              return {
                ...state,
                loginMessage: null
              };          
      default:
        return state;
    }
  }