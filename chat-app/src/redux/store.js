import {configureStore} from "@reduxjs/toolkit";
import {useDispatch as useAppDispatch, useSelector as useAppSelector} from "react-redux";
import {persistStore, persistReducer} from "redux-persist";
import { rootPersistConfig, rootReducer } from "./rootReducer";
// since contained in we are using the redux to manage the state of our app we are going to need react binding of redux means redux implementation
// for react-redux library. 3.redux persist is basically is going to allow us to basically persist the data, if we close the tab and refresh the page
// the state is not going to be lost.
//create store 1.  it is taking reducers 2. this redux is basically get to  app config and combined reducer
//middleware  - it is the thing that can run between writing and reading for another store
// to make our state persistable we need to wrap this inside persiststore
const store = configureStore({
    reducer : persistReducer(rootPersistConfig, rootReducer),
    middleware : (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
    }),
});

const persistor = persistStore(store);

const {dispatch} = store;
//it is used to dispatch action
const useSelector = useAppSelector;

const useDispatch = () => useAppDispatch();
//it is basically going to be a function which is used to call the useappdispatch

export {store, persistor, dispatch, useSelector, useDispatch}
