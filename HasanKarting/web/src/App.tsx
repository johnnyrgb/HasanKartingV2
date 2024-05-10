import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import userObject from './components/entities/userObject';
import Login from './components/authentication/login';
import Logout from './components/authentication/logout';
import Register from './components/registration/registration';
import Layout from './components/entities/layout/layout';
import Cars from './components/cars/cars';
import './App.css';
import axios from 'axios';
import Racers from './components/racers/racers';
import Races from './components/races/races';



function App() {
  const [user, setUser] = useState<userObject | null>(null);

  useEffect(() => {
    const getUser = async() => {
    
      await axios.get("https://localhost:7198/api/Account/isauthenticated", {
        withCredentials: true,
      })
      .then(function (response) {
        if (response.status === 200) {
          setUser(response.data)
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
        <Route path='/' element={<Layout user={user}/>}>
          <Route path='/login' element={<Login setUser={setUser}/>}/>
          <Route path='/logout' element={<Logout setUser={setUser}/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/cars' element={<Cars/>}/>
          <Route path='/racers' element={<Racers/>}/>
          <Route path='/races' element={<Races/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
