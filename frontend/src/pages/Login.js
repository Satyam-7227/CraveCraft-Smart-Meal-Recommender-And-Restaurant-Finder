import React,{useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login(){

    const navigate = useNavigate();
    const [formData, setFormData] = useState({email:'',password:''});

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post('http://localhost:5000/api/auth/login',formData);
            localStorage.setItem("token",res.data.token)
            alert(res.data.token);
        }
        catch(err){
            alert('login failed');
            console.log(err);
        }
    };

    return(
        <div className='form-container'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input name='email' type='email' placeholder='Email' onChange={handleChange} required/><br />
                <input name='password' type='password' placeholder='Password' onChange={handleChange} required/><br />
                <button type='submit'>Login</button>
                <button onClick={() => navigate('/register')} class='navigate_register'>Register Now</button>
            </form>
        </div>
    );
}

export default Login;