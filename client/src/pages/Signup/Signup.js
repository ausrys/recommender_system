import React from 'react';
import { Formik, Form } from 'formik';
import { TextField } from '../../components/TextField/TextField';
import * as Yup from 'yup';
import './signup_style.css';
import axios from 'axios';
export const Signup = () => {
  const validate = Yup.object({
    firstName: Yup.string()
      .max(15, 'Must be 15 characters or less')
      .required('Required'),
    lastName: Yup.string()
      .max(20, 'Must be 20 characters or less')
      .required('Required'),
    email: Yup.string()
      .email('Email is invalid')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 charaters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Password must match')
      .required('Confirm password is required'),
  })
  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={validate}
      onSubmit={values => {
        axios.post("http://localhost:5000/signup", values).then((response) => {
          console.log('IT worked')
        }).catch((err) => {
          console.log(err)
        })
      }}
    >
      {formik => (
        <div className='signup_page'>
          <div className='signup_image'>
          </div>
          <div className='registration-form'>
            <h1>Sign Up</h1>
          <Form>
            <TextField label="First Name" name="firstName" type="text" />
            <TextField label="Last Name" name="lastName" type="text" />
            <TextField label="Email" name="email" type="email" />
            <TextField label="Password" name="password" type="password" />
            <TextField label="Confirm Password" name="confirmPassword" type="password" />
            <button className='form-btn' type="submit">Register</button>
            <button className='form-btn' type="reset">Reset</button>
          </Form>
            </div>
          
        </div>
        
      )}
    </Formik>
  )
}