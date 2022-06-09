import React, { useState, useEffect } from 'react'
import Navbar from "./Navbar"
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import "../css/credential.css"

import Credential from "./credential"
const axios = require('axios');

const Credentials = (props) => {
    const [token, setIsToken] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [platform, setPlatform] = useState("")
    const [platformError, setPlatformError] = useState("")
    const [username, setUsername] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [credentials, setCredentials] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        axios({
            method: 'get',
            url: '/credentials',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            }

        }).then((response) => {
            setCredentials(response.data.AllCredentials);
            //  console.log(response);
            setIsToken(true)
            setIsLoading(false)
        }).catch((error) => {
            //console.log(error);
            if (error.response.status == 400) {
                navigate("/")
            }
        })
    }, [])

    function refresh() {
        axios({
            method: 'get',
            url: '/credentials',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            }

        }).then((response) => {
            setCredentials(response.data.AllCredentials);

        }).catch((error) => {
            if (error.response.status == 400) {
                navigate("/")
            }
        })
    }
    function add(e) {
        e.preventDefault();
        const data = {
            platform, username, password
        }
        axios({
            method: 'post',
            url: '/credentials/create',
            contentType: 'application/json',
            responseType: 'stream',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            },
            data: data
        }).then((response) => {
            // console.log(response);
            setPlatformError("")
            setPlatform("")
            setUsername("")
            setPassword("");
            setPasswordError("")
            setUsernameError("")
            refresh()
        }).catch((err) => {
            console.log(err);
            setPlatformError("")
            setPasswordError("")
            setUsernameError("")
            if (err.response.data.message) {
                setPlatformError(err.response.data.message)
            }
            if (err.response.data.errors) {
                const errors = err.response.data.errors;
                for (let i = 0; i < errors.length; i++) {

                    switch (errors[i].param) {
                        case "platform": setPlatform(errors[i].msg)
                            break;
                        case "username": setUsernameError(errors[i].msg)
                            break;
                        case "password": setPasswordError(errors[i].msg)
                            break;
                        default: (() => { })()

                    }
                }
            }

        });
    }
    return (
        <div className="home">
            {
                token ?
                    <div>
                        <Navbar selected={props.selected} />
                        <div className="showCredentials">
                            <div className="addCredentialForm">
                                <div className="addCredentialFormHeader">
                                    <h2>Add Credential</h2>
                                </div>
                                <form onSubmit={add}>
                                    <div className="addCredentialFormInput">
                                        <label>Platform:</label>
                                        <input type="text" value={platform} onChange={(e) => setPlatform(e.target.value)} required />
                                        <p>{platformError}</p>
                                    </div>
                                    <div className="addCredentialFormInput">
                                        <label>Username:</label>
                                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                        <p>{usernameError}</p>
                                    </div>
                                    <div className="addCredentialFormInput">
                                        <label>Password:</label>
                                        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                        <p>{passwordError}</p>
                                    </div>
                                    <div className="addCredentialFormbtn">
                                        <button type="submit">Add Credential</button>
                                    </div>
                                </form>
                            </div>
                            <div className="allcredentials">
                                {
                                    isLoading ?
                                        <div style={{ width: "100%", textAlign: "center" }}>
                                            <CircularProgress size="3rem" style={{ color: "blue", marginTop: "3px" }} />
                                        </div>
                                        : credentials.length == 0 ?
                                            <div className="NoEntries">
                                                <p>
                                                    No Credentials
                                                </p>
                                            </div>
                                            :

                                            credentials.map((credential, i) => (
                                                <Credential data={credential} key={i} refresh={refresh} />
                                            ))

                                }



                            </div>
                        </div>
                    </div> : ""
            }


        </div>
    )
}

export default Credentials