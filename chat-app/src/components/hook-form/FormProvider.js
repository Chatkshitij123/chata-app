//It is going to act like a wrapper  whenver we create a form in html we need to wrap all of the content of the form using that
//form part

import React from 'react'
import {FormProvider as Form} from "react-hook-form";
const FormProvider = ({children, onSubmit, methods}) => {
  return (
    <Form {...methods}>
      {/* this children is the whole content of the form */}
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  )
}

export default FormProvider
