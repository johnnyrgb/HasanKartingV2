import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import userObject from './components/entities/userObject';
import Login from './components/authentication/login';
import Logout from './components/authentication/logout';
import Register from './components/registration/registration';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';


interface ResponseModel {
  message: string;
  responseUser: userObject;
}
function App() {
  const [user, setUser] = useState<userObject | null>(null);

  useEffect(() => {
    const getUser = async() => {
    
      await axios.get("https://localhost:7198/api/Account/isauthenticated", {
        withCredentials: true,
      })
      .then(function (response) {
        console.log(response.status);
        if (response.status === 200) {
          setUser(response.data.responseUser)
        }
      })
      .catch(function (error) {
        console.error(error);
      })
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
