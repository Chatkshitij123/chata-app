import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
import axios from "../../utils/axios";

const initialState = {
  sidebar: {
    open: false,
    type: "CONTACT", // can be CONTACT, STARRED, SHARED
  },
  snackbar: {
    open: null,
    message: null,
    severity: null,
  },
  users: [],
  friends: [],
  friendsRequests: [],
  chat_type: null,//value for it will be group chat or individual chat
  room_id: null,//for each and very chat there will be a room id 
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    //toggle sidebar//every reducer is going to be accept two arguments 1 . state and 2. action//state will be the current
    // state of the reducer//action contains two things 1. type of action-string 2. payload-conatin the information
    toggleSidebar(state, action) {
      state.sidebar.open = !state.sidebar.open;
    },
    updateSidebarType(state, action) {
      state.sidebar.type = action.payload.type;
    },
    openSnackBar(state, action) {
      // console.log(action.payload);
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackBar(state, action) {
      // console.log("This is getting executed");
      state.snackbar.open = false;
      state.snackbar.message = null;
      // state.snackbar.message = action.payload.message;
    },

    updateUsers(state, action) {
      state.users = action.payload.users;
    },
    updateFriends(state, action) {
      state.friends = action.payload.friends;
    },
    updateFriendsRequests(state, action) {
      state.friendsRequests = action.payload.request;
    },
    selectConversation(state, action) {
      state.chat_type = "individual";
      state.room_id = action.payload.room_id;
    }
  },
  //reducers are going to update our state in redux
});

export default slice.reducer;

export function ToggleSidebar() {
  return async (dispatch, getState) => {
    // whcich we call inside thunk as an argument for the hold of the current state of the app
    dispatch(slice.actions.toggleSidebar());
  };
}

export function UpdateSidebarType(type) {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.updateSidebarType({
        type,
      })
    );
  };
}

export function showSnackbar({ severity, message }) {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.openSnackBar({
        message,
        severity,
      })
    );

    setTimeout(() => {
      dispatch(slice.actions.closeSnackBar());
    }, 200);
  };
}

export const closeSnackBar = () => async (dispatch, getState) => {
  dispatch(slice.actions.closeSnackBar());
};

export const FetchUsers = () => {
  return async (dispatch, getState) => {
    await axios
      .get("/user/get-users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      })
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.updateUsers({ users: response.data.data }));
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const FetchFriends = () => {
  return async (dispatch, getState) => {
    await axios
      .get("/user/get-friends", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      })
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.updateFriends({ friends: response.data.data }));
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const FetchFriendRequests = () => {
  return async (dispatch, getState) => {
    await axios
      .get("/user/get-friend-requests", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      })
      .then((response) => {
        console.log(response);
        dispatch(
          slice.actions.updateFriendsRequests({ request: response.data.data })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const SelectConversation = ({room_id}) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.selectConversation({room_id}));
  }
}