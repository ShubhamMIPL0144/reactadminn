import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from '@reduxjs/toolkit'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authSlice from './authSlice';



const persistConfig = {
  key: 'root',
  storage,
}

const reducers = combineReducers({
  auth:authSlice,

})

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})


