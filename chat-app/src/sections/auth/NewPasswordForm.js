import React, { useState } from 'react'
import * as Yup from 'yup';
import {Link as RouterLink, useSearchParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import FormProvider from '../../components/hook-form/FormProvider';
import { Alert, Button, IconButton, InputAdornment, Stack } from '@mui/material';
import { RHFTextField } from '../../components/hook-form';
import { Eye, EyeSlash} from 'phosphor-react';
import { NewPassword } from '../../redux/slices/auth';
import { useDispatch } from 'react-redux';

const NewPasswordForm = () => {
  const [queryParameters] = useSearchParams();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
// using this ref property we can actually fetch the value that is written inside the newPassword we are creating
// this array so one this be the one in inserting this newPassword and second will be null if it that of the case when the Userhas not entered
// anything There is a condition when passwordConfirm one of these either null or we entered inside the newPassword we are going to 
// through this error.this validation is on frontend and then we will sending the data to BracketsRound. it is just the externalsecurity
  const NewPasswordSchema = Yup.object().shape({
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      passwordConfirm: Yup.string().required("Password is required").oneOf([Yup.ref("password"), null], "Password must match"),
  });

  const defaultValues = {
    password: "",
    passwordConfirm: "",
  }

  const methods = useForm({
    resolver: yupResolver(NewPasswordSchema),
    defaultValues,
  });

  const {reset, setError, handleSubmit, formState: {errors, isSubmitting, isSubmitSuccessful}} = methods;

  const onSubmit = async (data) => {
    try{
      //submit data to backend
      dispatch(NewPassword({...data, token: queryParameters.get("token")}))
    }
    catch(error){
      console.log(error);
      reset();
      setError("afterSubmit", {
        ...error,
        message: error.message,
      })
    }
  }
  return (
   <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

    <Stack spacing={3}>
    {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
   

    
    <RHFTextField name="password" label="New Password" type={showPassword ? "text" : "password"} 
    InputProps={{
      endAdornment: (
        <InputAdornment>
        <IconButton onClick={() => {
          setShowPassword(!showPassword);
        }}>
          {showPassword ? <Eye/> : <EyeSlash/>}
          </IconButton>
          </InputAdornment>
  )
    }}/>
    <RHFTextField name="passwordConfirm" label="Confirm Password" type={showPassword ? "text" : "password"} 
    InputProps={{
      endAdornment: (
        <InputAdornment>
        <IconButton onClick={() => {
          setShowPassword(!showPassword);
        }}>
          {showPassword ? <Eye/> : <EyeSlash/>}
          </IconButton>
          </InputAdornment>
  )
    }}/>
    <Button fullWidth color="inherit" size="large" type="submit" variant="contained" sx={{bgcolor: "text.primary",
      color: (theme) => theme.palette.mode === "light" ? "common.white" : "grey.800",
      '&:hover': {
        bgcolor: "text.primary",
        color: (theme) => theme.palette.mode === "light" ? "common.white" : "grey.800",
      }}}>
      Submit
     </Button>
     </Stack>
    
     
   </FormProvider>
  )
}

export default NewPasswordForm;
