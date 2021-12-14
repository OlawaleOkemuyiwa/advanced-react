import React from 'react';
import Button from '../UI/Button/Button';

import Card from '../UI/Card/Card';
import classes from './Home.module.css';

const Home = props => {
  return (
    <Card className={classes.home}>
      <h1>Welcome back!</h1>
      <Button onClick={props.onLogout}>Logout</Button> {/*CCC14: we still pass the onLogout func to Button component through props and didnt use context to pass it directly because that would mean the button is now hard coded to always trigger the onLogout func to log users out when it is clicked and nothing else. This is undesirable as sometimes we wish to configure a component from inside the parent where we are using them by setting their attributes in there and not just with a specific data*/}
    </Card>
  );
};

export default Home;
