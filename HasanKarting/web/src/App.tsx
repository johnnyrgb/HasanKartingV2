import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import userObject from './components/entities/userObject';
import Login from './components/authentication/login';
import Logout from './components/authentication/logout';
import Register from './components/registration/registration';
import logo from './logo.svg';
import './App.css';


interface ResponseModel {
  message: string;
  responseUser: userObject;
}
function App() {
  const [user, setUser] = useState<userObject | null>(null);

  useEffect(() => {
    const getUser = async() => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Access-Control-Allow-Credentials": "true"
        },
      };

      return await fetch("api/Account/isauthenticated", requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data: ResponseModel) => {
        setUser(data.responseUser);
      }, (error) => console.log(error));
    };
    getUser();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login setUser={setUser}/>}/>
        <Route path='/logout' element={<Logout setUser={setUser}/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
