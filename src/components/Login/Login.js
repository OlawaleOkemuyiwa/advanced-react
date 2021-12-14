import React, { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const emailReducer = (latestState, action) => {                           //CCC8: this reducer function is created outside the Login component function because the reducer CB function doesnt need any data that is generated inside the component function so it can be created outside of it. All the data that would be required and used inside of the reducer function will be automatically passed into the function by React on its execution
  if(action.type === 'USER_INPUT') {
    return {value: action.val, isValid: action.val.includes('@')}  
  } 

  if(action.type === 'INPUT_BLUR') {
    return {value: latestState.value, isValid: latestState.value.includes('@')}  
  }  
  return {value: '', isValid: null};                                //if no condition is satisfied, default state is returned 
};

const passwordReducer = (latestState, action) => {
  if (action.type === 'USER_INPUT') {
    return {value: action.val, isValid: action.val.length > 6}
  }

  if (action.type === 'INPUT_BLUR') {
    return {value: latestState.value, isValid: latestState.value.length > 6}
  }
  return {value: '', isValid: null};
}



const Login = props => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState(null);
  // const [enteredPassword, setEnteredPassword] = useState('');
  //const [passwordIsValid, setPasswordIsValid] = useState(null);
  const [formIsValid, setFormIsValid] = useState(false);


  //enteredEmail value state and its validity state are grouped into 1 single state and managed at 1 place using useReducer(); setting a state by depending directly on another state is bad practice, useReducer() helps to solve this
  //CCC6: useReducer() returns an array with 2 elements: state and the dispatch function(CCC8) which triggers the re-execution of component with an updated state. useReducer() takes 3 arguments: the 1st is the reducer CB function which has 2 parameters (latestState and action: latestState argument is the guaranted latest state provided by React while action argument is the data passed to the dispatch function call). The 2nd argument is the initial value of state(initial value of emailState on first execution of Login component). The 3rd argument is the initial function which is rarely used
  const [emailState, dispatchEmail] = useReducer(emailReducer, {value: '', isValid: null});

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {value: '', isValid: null});

  const { isValid: emailIsValid } = emailState;  //CCC10: destructuring the state object to get valid state so that we get the exact dependency needed for the useEffect. This is also useful when working with props object as useEffect depencies. It is proper to destructure and take the exact values we depend on and not the entire props
  const { isValid: passwordIsValid} = passwordState;

  
  useEffect(() => {                                //CCC2: useEffect helps to deal with code that should be executed in responses to something.
    const timeOutIdentifier = setTimeout(() => {
      console.log('check validity')
      setFormIsValid(emailIsValid && passwordIsValid); //CCC9: An okay way to update state based on another state cause with useEffect, we're guaranted that the code will run after each time the component is re-executed with updated state(which is a change in its dependencies) 
    }, 500);

    return () => {                                //CCC4: This is a cleanup function that runs before every new useEffect CB function execution except for the very first time the useEffect CB func executes(first execution of component) inwhich only the CB function runs. Therefore: after the first execution of component, the CB func of useEffect runs and the code in it is evaluated. If there is a change in its dependencies, after the next re-execution of the component the cleanup function runs first before the actual callback function of the useEffect. 
      console.log('CLEAN UP') 
      clearTimeout(timeOutIdentifier);            //using the clean up function to clear the timer that was set in the last useEffect func so that when the new useEffect func execution is due, we set a brand new timer
    };                                            //CCC5: if the dependencies array is empty (i.e. the useEffect CB func only runs once after first execution of the component and never again), the cleanUp func would run ONLY when the component is removed from the DOM
  }, [emailIsValid, passwordIsValid]);                //CCC3: if useEffect should rerun based on some change in dependencies, the general rule of thumb is to add all the external data and functions from the surrounding component function which are being used in the useEffect CB function as such dependencies
  

  const emailChangeHandler = event => {
    dispatchEmail({type: 'USER_INPUT', val: event.target.value}); //CCC7: we pass to the dispatch function call an action(could be a string identifier, or a number but often its an object which has some fields that holds some identifiers as shown here). The dispatch function call triggers the reducer function execution and the reducer func then gets the action argument from the dispatch func. The returned value from the reducer function would now be the new state on the re-execution of the component

    //setFormIsValid(event.target.value.includes('@') && passwordState.isValid);
  };
  
  const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_BLUR'})
  };

  const passwordChangeHandler = event => {
    dispatchPassword({type: 'USER_INPUT', val: event.target.value})

    //setFormIsValid(event.target.value.trim().length > 6 && emailState.isValid);  //we still depend directly on another state to update our state, this is bad practice so form validility is done by useEffect
  }; 

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'INPUT_BLUR'})
  };

  const submitHandler = event => {
    event.preventDefault();
    props.retrieveLoginDetails(emailState.value, passwordState.value);
  };
  
  return (        //CCC0: onBlur event is triggered whenever the inputs blur i.e whenever they lose focus
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div className={`${classes.control} ${emailState.isValid === false ? classes.invalid : ''}`}>
          <label htmlFor="email">E-Mail</label>
          <input type="email" value={emailState.value} onChange={emailChangeHandler} onBlur={validateEmailHandler} id="email"/>
        </div>
        <div className={`${classes.control} ${passwordState.isValid === false ? classes.invalid : ''}`}>
          <label htmlFor="password">Password</label>
          <input type="password" value={passwordState.value} onChange={passwordChangeHandler} onBlur={validatePasswordHandler} id="password"/>
        </div>
        <div className={classes.actions}>
          <Button type="submit" disabled={!formIsValid} className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
