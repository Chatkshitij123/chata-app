import React from "react";
import Chats from "./Chats";
import { Box, Stack, Typography } from "@mui/material";
import {useTheme} from "@mui/material/styles";
import Conversation from "../../components/Conversation";
import Contact from "../../components/Contact";
import { useSelector } from "react-redux";
import SharedMessages from "../../components/SharedMessages";
import StarredMessages from "../../components/StarredMessages";
import NoChatSVG from "../../assets/Illustration/NoChat";

//dynamic import- it will take some amount of time
// const Cat = lazy(() => import("../../components/Cat"));
//This component is responsible for rendering the chat component and for conversation component
//calc function is used because we used to acquire all of the available space 
const GeneralApp = () => {
const theme = useTheme();
const {sidebar, chat_type, room_id} = useSelector((store) => store.app);

  return (
    <Stack direction={"row"} sx={{width: "100%"
    }}    >
    <Chats/>
   
    <Box  sx={{height: "100vh", width: sidebar.open ? "calc(100vw - 740px)" : "calc(100vw - 420px)" ,
    backgroundColor: theme.palette.mode === "light" ? "#F0F4FA" : theme.palette.background.paper
    }}>
      {/* video28 */}
      {room_id !== null && chat_type === "individual" ? <Conversation/> :
      <Stack spacing={2} sx={{height: "100%", width: "100%"}} alignItems={"center"} justifyContent={"center"}>
         <NoChatSVG />
         <Typography variant="subtitle2">
            Select a conversation or start new one
         </Typography>
      </Stack>
       }
       {/* conversation */}
       
    </Box>
    {/* Contact */}
    {/* how do we switch between shared messages system and contacts panel
    we are maintaining this state called type */}
    {/* we are going to place a condition; like we are going to cluster what is the type of sidebar
    we created iife-immediately invoked function expression */}

    {/* {sidebar.open && (() => {
     switch(sidebar.type){
      case "CONTACT":
         return <Contact/>;
      case "STARRED":
         break;
      case "SHARED":
         return <SharedMessages/>;
        
         default:
            break;
     }
    })()} */}
    {sidebar.open && (() => {
      switch (sidebar.type) {
         case "CONTACT":
            return <Contact/>;
         case "STARRED":
         return <StarredMessages/>;
         case "SHARED":
         return <SharedMessages/>;
      
         default:
            break;
      }
    })()} 
    
    
    
    </Stack>
   );
};

export default GeneralApp;
