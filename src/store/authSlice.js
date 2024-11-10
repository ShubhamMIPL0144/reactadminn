import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  auth: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.auth = action.payload;
    },
    resetAuth: (state) => {
        return initialState;
      },
  
  },
})

export const {setCurrentUser,resetAuth} = authSlice.actions

export default authSlice.reducer
