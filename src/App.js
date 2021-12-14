import React, { useState, useEffect } from 'react';

import Login from './components/Login/Login';
import Home from './components/Home/Home';
import MainHeader from './components/MainHeader/MainHeader';
import AuthContext from './store/auth-context';

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {         //CCC1: useEffect is a react hook that accept 2 arguments, a call back function and an array of dependencies. We perform side effects tasks like http requests, getting items in local storage etc in callback function. After the first execution of a component, the CB function runs and the code in it is executed. AFTER each re-execution of the component (maybe due to state update or sth), the CB function only re-reruns if there is a change in any of the dependencies stored in the dependencies array. If such array is empty, then we have no dependencies therefore after the CB function runs after the first execution of the component, it never runs again even when the component gets re-executed because we have no dependencies we could check for a change in its value.
    const storedIsLoggedInInfo = JSON.parse(localStorage.getItem('isLoggedIn'));
    if (storedIsLoggedInInfo){
      setIsLoggedIn(true);
    }
  }, []);

  const loginHandler = (email, password) => {
    // We should of course check email and password
    // But it's just a dummy/ demo anyways
    localStorage.setItem('isLoggedIn', JSON.stringify(true));
    setIsLoggedIn(true);

    //console.log(email, password);
  };

  const logoutHandler = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{isLoggedIn: isLoggedIn, onLogout: logoutHandler}}>
      <MainHeader />  {/*CCC11: isLoggedIn state and logoutHandler are passed to MainHeader component but these data are not primarily needed in the MainHeader instead only forwarded by props to its child Navigation component which in larger apps lead to a long undesirable prop chain merely used to forward data. React context helps this data passing issue*/}
        <main>
          {!isLoggedIn && <Login retrieveLoginDetails={loginHandler} />}
          {isLoggedIn && <Home onLogout={logoutHandler} />}
        </main>
    </AuthContext.Provider>
  );
}

export default App;
