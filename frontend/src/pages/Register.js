import React,{useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register(){

    const navigate = useNavigate();
    const [formData,setFormData] = useState({name:'',email:'',password:''});

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post("http://localhost:5000/api/auth/register",formData);
            alert(res.data.message);
        }
        catch(err){
            alert("Registeration falied");
            console.log(err);
        }
    };

    return(
        <div className='form-container'>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input name='name' type='text' placeholder='Name' onChange={handleChange} required/>
                <input name='email' type='email' placeholder='Email' onChange={handleChange} required/><br />
                <input name='password' type='password' placeholder='Password' onChange={handleChange} required/><br />
                <button type='submit'>Register</button>
                <button onClick={() => navigate('/login')} class='navigate_login'>Login Now</button>
            </form>
        </div>
    );
}

export default Register;