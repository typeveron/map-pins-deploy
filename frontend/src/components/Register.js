import React, {useRef} from 'react'
import "./register.css"
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {axios} from 'axios';

export default function Register() {

  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      //does not refresh page
      e.preventDefault();
      const newUser = {
          username: nameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
      };

      try {
         const {data} = await axios.post(process.env.REGISTER_URL, newUser);
         toast.success("Sign in successfully");
            //save user in local storage
            if (typeof window !== "undefined") {
              localStorage.setItem("token", JSON.stringify(data))
            }
          navigate("/map");
      } catch (err) {
        toast.error(err.response.data.error);
        console.log(err);
      }
  }
  
  return (
    <div className='registerContainer'>
    <div className='logo'></div>
    <AddLocationAltIcon/>
    Pin
    <form  className='regForm' onSubmit={handleSubmit}>
    <input type='text' className='textR' placeholder='username' ref={nameRef}/>
    <input type='email' className='emailR' placeholder='email' ref={emailRef}/>
    <input type='password' className='passwordR' placeholder='password' ref={passwordRef}/>
    <button className='registerBtn'>Register</button>
    <button onClick={() => navigate('/')} className='backToLogin'>Back To Login</button>
    </form>
    </div>
  )
}
