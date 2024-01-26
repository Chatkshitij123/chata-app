//video 27
import { Dialog, DialogContent, Stack, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchFriendRequests,
  FetchFriends,
  FetchUsers,
} from "../../redux/slices/app";
import {
  FriendComponent,
  FriendRequestComponent,
  UserComponent,
} from "../../components/Friends";
const UserList = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(FetchUsers());
  }, []);

  return (
    <>
      {users.map((el, idx) => {
        //
        return <UserComponent key={el._id} {...el} />;
      })}
    </>
  );
};

const FriendsList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchFriends());
  }, []);

  const { friends } = useSelector((state) => state.app);
  return (
    <>
      {friends.map((el, idx) => {
        return <FriendComponent key={el._id} {...el} />;
      })}
    </>
  );
};

const FriendRequestList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchFriendRequests());
  }, []);

  const { friendsRequests } = useSelector((state) => state.app);
  return (
    <>
      {friendsRequests.map((el, idx) => {
        //el => {_id, sender: {_id,firstName, lastName, img, online}}
        return (
          <FriendRequestComponent key={el._id} {...el.sender} id={el._id} />
        );
      })}
    </>
  );
};

const Friends = ({ open, handleClose }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    //we get the newValue after the tab is clicked
    setValue(newValue);
  };
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      keepMounted
      onClose={handleClose}
      sx={{ p: 4 }}
    >
      <Stack p={2} sx={{ width: "100%" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Explore" />
          <Tab label="Friends" />
          <Tab label="Requests" />
        </Tabs>
      </Stack>
      {/* Dialogue Content */}
      <DialogContent>
        <Stack sx={{ height: "100%" }}>
          <Stack spacing={2.5}>
            {/* iife */}
            {(() => {
              switch (value) {
                case 0: //display all users
                  return <UserList />;

                case 1: //display all friends
                  return <FriendsList />;

                case 2: //display all friends requests
                  return <FriendRequestList />;

                default:
                  return null;
              }
            })()}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default Friends;
