import { initialSearchState } from '../states/search.state';
import * as SearchAction from '../actions/search.action';


export default function searchReducer(
    state = initialSearchState,
    action: SearchAction.SearchAction
  ) {
    switch (action.type) {  
        case SearchAction.SET_SEARCH:
              return {
                  query: action.payload.query,
              };  
        case SearchAction.CLEAR_SEARCH:
              return {
                  query: null
              };        
      default:
        return state;
    }
  }