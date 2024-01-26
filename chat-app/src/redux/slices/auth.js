//video 21- this is to basically maintain all of the properties if the user is logged in what is user's token  and that will be access token and also there will
//be thunk operations - for handling asynchronus operations like calling our api for logging in and  reset password.

import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
// import axios from "axios";
import { showSnackbar } from "./app";
const initialState = {
  isLoggedIn: false, // when the user visited the app first time
  token: "",
  isLoading: false, //keep track of our form is submitted successfully or not
  // user: null,
  // user_id: null,
  email: "", //when user submit the email from the form we store it in redux and then send it to backend
  error: false,
};
//create slice
const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },
    logIn(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      // state.user_id = action.payload.user_id;
    },
    signOut(state, action) {
      state.isLoggedIn = false;
      state.token = "";
      // state.user_id = null;
    },
    updateRegisterEmail(state, action) {
      //inorder to save the user email
      state.email = action.payload.email;
    },
  },
});

//Reducer

export default slice.reducer;

//Log in

//here we written high order function- it is the function that returns the another function inside it

export function LoginUser(formValues) {
  //form Values => {email, password}
  return async (dispatch, getState) => {
    //dispatch - which is going to be comes as a argument to another function//getState - to current state of the app
    // dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
    await axios
      .post(
        "/auth/login",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);

        dispatch(
          slice.actions.logIn({
            isLoggedIn: true,
            token: response.data.token,
            // user_id: response.data.user_id,
          })
        );
          console.log(response.data);
        window.localStorage.setItem("user_id", response.data.user_id);

        dispatch(showSnackbar({severity: "success", message: response.data.message}))
      })
      .catch(function (error) {
        console.log(error);
        dispatch(showSnackbar({severity: "error",message: error.message}))
      });
  };
}
//video 22
export function LogoutUser() {
  return async (dispatch, getState) => {
    window.localStorage.removeItem("user_id");
    dispatch(slice.actions.signOut());
  };
}

export function ForgotPassword(formValues) {
  return async (dispatch, getState) => {
    await axios
      .post(
        "/auth/forgot-password",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch((error) => {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: error.message }));
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      });
  };
}

export function NewPassword(formValues) {
  return async (dispatch, getState) => {
    await axios
      .post(
        "/auth/reset-password",
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(
          slice.actions.logIn({
            isLoggedIn: true,
            token: response.data.token,
          })
        );
        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch((error) => {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: error.message }));
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      });
  };
}
//video 23
export function RegisterUser(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
    await axios
      .post(
        "/auth/register",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(
          slice.actions.updateRegisterEmail({ email: formValues.email })
        );
        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        ); //that is going to update the isLoading and error
      })
      .catch((error) => {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: error.message }));
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      })
      .finally(() => {
        if (!getState().auth.error) {
          window.location.href = "/auth/verify"; //if there is no error
        }
      });
  };
}

export function VerifyEmail(formValues) {
  return async (dispatch, getState) => {
    await axios
      .post(
        "/auth/verify",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      //when we are going to receive the response its our duity to logged the user in if they are successfully verified then they generate the 
      //jwt token in our store  and also update the property of islogged in.
      .then((response) => {
        console.log(response);
        dispatch(
          slice.actions.logIn({
            isLoggedIn: true,
            token: response.data.token,
          })
        );

        window.localStorage.setItem("user_id", response.data.user_id);
        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
      })
      .catch((error) => {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: error.message }));
      });
  };
}
