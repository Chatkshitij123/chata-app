import { Box,Stack,} from '@mui/material';
import React from 'react';
import Header from "./Header";
import Footer from "./Footer";
import Messages from './Messages';
// import Message from './Message';





const Conversation = () => {
    
  return (
    <Stack className="scrollbar" height={"100%"} max-height={"100vh"} width={"auto"} >
   {/* chatheader */}
   <Header/>
   {/* Msg */}
  
   <Box
        sx={{
          width: "100%",
          flexGrow: 1,
          height: "100%",
          overflowY: "scroll",
        }}
        className="scrollbar"
      >
  {/* <Message/> */}
  <Messages menu={true}/>
        </Box>
{/* Chat footer */}
  <Footer/>
    </Stack>
  )
}

export default Conversation
