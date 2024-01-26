//it is going to take all of the slices  and it will combine all the reducers
 import { combineReducers } from "redux";
 import storage from "redux-persist/lib/storage";
 //persist gives us access to our local storage
import appReducer from "./slices/app"
import authReducer from "./slices/auth";
import conversationReducer from "./slices/conversation";
//slices

//this is going to be defined how our data is going to be store and  read out of the redux store

const rootPersistConfig = {
    key : "root",
    storage,
    keyPrefix: "redux-",
    //whitelist [],//the name of the state that we want to persist
    //blacklist []// we can define the name of the reduce which we don't want to persist
}

const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    conversation: conversationReducer,
});

export {rootPersistConfig, rootReducer};