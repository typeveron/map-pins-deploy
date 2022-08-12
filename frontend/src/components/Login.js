import React, {useState} from 'react'
import "./login.css"
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import {useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import {axios} from 'axios';

export default function Login() {

  const [values, setValues] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const {username, password} = values;

  const handleChange = name => (e) => {
    setValues({...values, [name]: e.target.value})
  }

  console.log(process.env.LOGIN_URL);

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const {data} = await axios.post(process.env.LOGIN_URL, {
            username, password
          });
          console.log(data);

          if (data.success === true) {
            setValues({username: '', password: ''})
            toast.success("Sign in successfully");
            //save user in local storage
            if (typeof window !== "undefined") {
              localStorage.setItem("token", JSON.stringify(data))
            }
            navigate("/map");
          }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
      }
    } 


  
  return (
    <div className='loginContainer'>
    <div className='logo'></div>
    <AddLocationAltIcon/>
    Pin
    <form className='loginForm'>
    <input type='text' className='usernameE' placeholder='username' onChange={handleChange('username')}/>
    <input type='password' className='passwordE' placeholder='password' onChange={handleChange('password')} />
    <button className='loginBtn' onClick={handleSubmit}>Login</button>
    <button onClick={() => navigate('/register')} className="loginRegister">
    Sign Up
    </button>
    </form>
    </div>
  )
}
