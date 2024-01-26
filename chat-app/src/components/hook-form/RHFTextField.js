//we r going to create control component so this is basically control input component
import { PropTypes } from "prop-types";
//form
import {useFormContext, Controller}  from "react-hook-form";
// useFormContext is actually going to give us the access to the other properties that are actually associated with our form.
// controller is actually going to be a simple component which is going to be controlled component out of normal html or libraries
// of our mui 
//@mui
import {TextField} from "@mui/material";

RHFTextField.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    helperText: PropTypes.node,
}

export default function RHFTextField({name, helperText, ...other}) {
    const {control} = useFormContext();
    //it is a hook that is present inside react-hook-form
    //what component are we converting into a controlled component inside this function. render is going to accept the function
    //and whatever be written here like textfield  that will be rendered as the result of the rendered component
    return (
        <Controller 
        name={name}
         control={control}
          render={({field, fieldState: {error}}) => (
            <TextField
             {...field}
              fullWidth
              value={
                typeof field.value === "number" && field.value === 0
                ? ""
                : field.value
              }
               error={!!error}
                helperText={error ? error.message : helperText}
                 {...other}
                 />
        )}/>
    )
}