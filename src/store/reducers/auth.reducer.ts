import { initialAuthState } from '../states/auth.state';
import * as AuthAction from '../actions/auth.action';


export default function authReducer(
    state = initialAuthState,
    action: AuthAction.AuthAction
  ) {
    switch (action.type) {
        case AuthAction.SET_LOGIN:
            return {
                userId: action.payload.userId,
                username: action.payload.username,
                profile: action.payload.profile,
                accessToken: action.payload.accessToken,
                isLoggedIn: action.payload.isLoggedIn
            };      
        case AuthAction.SET_AUTH:
              return {
                  userId: action.payload.userId,
                  username: action.payload.username,
                  profile: action.payload.profile,
                  accessToken: action.payload.accessToken,
                  isLoggedIn: action.payload.isLoggedIn
              };  
        case AuthAction.LOGOUT:
                return {
                    userId: null,
                    username: null,
                    profile: null,
                    accessToken: null,
                    isLoggedIn: false
                };        
      default:
        return state;
    }
  }