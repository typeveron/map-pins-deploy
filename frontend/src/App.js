import React, {Fragment}  from 'react';
import "./app.css"
import Register from "./components/Register";
import Login from "./components/Login";
import MapPage from "./components/MapPage";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {

  return (
    <Fragment>
    <ToastContainer/>
    <BrowserRouter>
    <Routes>
    <Route path="/map" element={<MapPage/>}
    />
    <Route path="/" element={<Login/>}
    />
    <Route path="/register" element={<Register/>}
    />
    </Routes>
    </BrowserRouter>
    </Fragment>
  );
}

export default App;
