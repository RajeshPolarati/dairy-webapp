import React from 'react'
import Register from "./Register"
import Login from "./Login"
import "../css/Main.css"
import Logo from "../images/logo1.jpg"
import { useState } from 'react'
const Main = () => {
    const [type, setType] = useState("login")
    return (
        <div className="main-component">
            <div className="logo-image-div">
                <img src={Logo} className="logo-image" />
            </div>
            <div className="Main-form">
                {
                    type === "login" ? <Login setType={setType} /> : <Register setType={setType} />
                }

            </div>
        </div>
    )
}

export default Main