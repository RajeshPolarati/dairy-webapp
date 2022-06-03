import React from 'react'
import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
const axios = require('axios');
const Login = (props) => {
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isProgress, setIsProgress] = useState(false)
    const navigate = useNavigate();
    function handleLogin(e) {
        e.preventDefault();
        setIsProgress(true)
        axios({
            method: 'post',
            url: '/auth/login',
            contentType: 'application/json',
            responseType: 'stream',
            data: {
                password, email
            }
        }).then((response) => {
            setIsProgress(false)
            console.log(response);
            if (response.status == 200) {
                localStorage.setItem("authToken", response.data.authToken)
                navigate("/home")
            }
        }).catch((err) => {

            setIsProgress(false)
            console.log(err);
            if (err.response.data.errors) {
                const errors = err.response.data.errors;
                for (let i = 0; i < errors.length; i++) {
                    switch (errors[i].param) {
                        case "email": setEmailError(errors[i].msg)
                            break;
                        case "password": setPasswordError(errors[i].msg)
                            break;
                        default: (() => { })()

                    }
                }
            }
            if (err.response.data.message) {
                const error = err.response.data.message;
                setEmailError("")
                setPasswordError("")
                if (err.response.status == "404") {
                    setEmailError(error)
                }
                if (err.response.status == "401") {
                    setPasswordError(error)
                }

            }
        });

    }
    return (
        <form className="login-form" onSubmit={handleLogin}>
            <div className="login-form-header">
                <h2>Sign In</h2>
            </div>
            <div className="login-form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email address" required />
                <p>{emailError}</p>
            </div>
            <div className="login-form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" required />
                <p>{passwordError}</p>
            </div>
            <div className="login-form-not">
                <p onClick={() => { props.setType("register") }} className="openregister">Not a user? Sign up here</p>
            </div>
            <div className="login-form-btn">
                <button type="submit" id="loginbtn" disabled={isProgress ? true : false}>{isProgress ? <CircularProgress size="1.5rem" style={{ color: "white", marginTop: "3px" }} /> : "Sign in"}</button>
            </div>
        </form>
    )
}

export default Login