import React, { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
const axios = require('axios');
const Register = (props) => {
    const [isProgress, setIsProgress] = useState(false)
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [ageError, setAgeError] = useState("")
    const [mobileError, setMobileError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [cpasswordError, setCpasswordError] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [age, setAge] = useState("")
    const [mobile, setMobile] = useState("")
    const [password, setPassword] = useState("")
    const [cpassword, setCpassword] = useState("")
    function validate() {
        let isValid = true;
        if (name.match(/^[a-zA-Z]{5,20}$/)) {
            setNameError("")
        } else {
            setNameError("Username should have min 5 letters")
            isValid = false
        }
        if (password.match(/[a-zA-Z0-9]{8,}/)) {
            setPasswordError("")
        } else {
            setPasswordError("password should contain numbers and upper and lowercase letters")
            isValid = false
        }
        if (age.match(/^[1-9]{1,}$/)) {
            setAgeError("")
        } else {
            setAgeError("Age should be valid")
            isValid = false
        }
        if (mobile.match(/^\d{10}$/)) {
            setMobileError("")
        } else {
            setMobileError("Mobile Number should number contain 10 digits")
            isValid = false
        }
        return isValid
    }
    function handleForm(e) {
        e.preventDefault();
        if (validate()) {

            setIsProgress(true)
            axios({
                method: 'post',
                url: '/auth/register',
                contentType: 'application/json',
                responseType: 'stream',
                data: {
                    name, age, mobile, password, email
                }
            }).then((response) => {

                setIsProgress(false)
                console.log(response);
            }).catch((err) => {
                setIsProgress(false)
                // console.log(err);
                if (err.response.data.errors) {
                    const errors = err.response.data.errors;
                    for (let i = 0; i < errors.length; i++) {
                        switch (errors[i].param) {
                            case "name": setNameError(errors[i].msg)
                                break;
                            case "email": setEmailError(errors[i].msg)
                                break;
                            case "age": setAgeError(errors[i].msg)
                                break;
                            case "mobile": setMobileError(errors[i].msg)
                                break;
                            case "password": setPasswordError(errors[i].msg)
                                break;
                            default: (() => { })()

                        }
                    }
                }
            });
        }

    }

    return (
        <form className="register-form" onSubmit={handleForm}>
            <div className="register-form-header">
                <h2>Sign Up</h2>
            </div>
            <div className="register-form-group">
                <label>Name</label>
                <input value={name} type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
                <p>{nameError}</p>
            </div>
            <div className="register-form-group">
                <label>Email</label>
                <input value={email} type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email address" required />
                <p>{emailError}</p>
            </div>
            <div className="register-form-group">
                <label>Age</label>
                <input value={age} type="text" onChange={(e) => setAge(e.target.value)} placeholder="Enter your name" required />
                <p>{ageError}</p>
            </div>
            <div className="register-form-group">
                <label>Mobile</label>
                <input value={mobile} type="text" onChange={(e) => setMobile(e.target.value)} placeholder="Enter your Mobile number" required />
                <p>{mobileError}</p>
            </div>
            <div className="register-form-group">
                <label>Password</label>
                <input value={password} type="password" onChange={(e) => {
                    setPassword(e.target.value)
                    cpassword !== e.target.value && cpassword !== "" ? setPasswordError("confirm password doesn't match with password") : setPasswordError("")
                }
                } placeholder="Enter Password" required />
                <p>{passwordError}</p>
            </div>
            <div className="register-form-group">
                <label>Confirm Password</label>
                <input value={cpassword} type="password" onChange={(e) => {
                    setCpassword(e.target.value)
                    password !== e.target.value && e.target.value !== "" ? setCpasswordError("confirm password doesn't match with password") : setCpasswordError("")
                }} placeholder="Enter Confirm Password" required />
                <p>{cpasswordError}</p>
            </div>
            <div className="register-form-not">
                <p onClick={() => { props.setType("login") }}>Already a user? Sign in here</p>
            </div>
            <div className="register-form-btn">
                <button type="submit" id="signupbtn" disabled={isProgress ? true : false}>{isProgress ? <CircularProgress size="1.5rem" style={{ color: "white", marginTop: "3px" }} /> : "Sign Up"}</button>
            </div>
        </form>

    )
}

export default Register