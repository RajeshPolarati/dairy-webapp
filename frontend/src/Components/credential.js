import React, { useState, useEffect } from 'react'
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
const axios = require('axios');
const Credential = (props) => {
    const [platform, setPlatform] = useState("")
    const [platformError, setPlatformError] = useState("")
    const [username, setUsername] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [crendentials, setCrendentials] = useState([])
    const [createdAt, setCreatedAt] = useState("")
    const [updatedAt, setUpdateddAt] = useState("")
    const [edit, setEdit] = useState(false)
    useEffect(() => {
        setCreatedAt(convert(props.data.createdAt))
        setUpdateddAt(convert(props.data.updatedAt))
        setPlatform(props.data.platform)
        setUsername(props.data.username)
        setPassword(props.data.password)
    }, [])
    function convert(value) {
        let localDate = new Date(value).toLocaleString().replaceAll("/", "-").split(" ")
        return localDate[0] + " " + localDate[1]
    }

    function openalert() {
        document.getElementById("alert").classList.add("alertopen")
    }
    function closealert() {
        document.getElementById("alert").classList.remove("alertopen")
        document.getElementById("alert").classList.add("alertclose")
        setTimeout(() => {
            document.getElementById("alert").classList.remove("alertclose")
        }, 300)

    }
    function handleDelete() {

        axios({
            method: 'delete',
            url: `/credentials/${props.data.id}`,
            contentType: 'application/json',
            responseType: 'stream',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            },
        }).then((response) => {
            console.log(response);
            closealert();

        }).catch((err) => {
            console.log(err);

        });
    }

    function updateCrential(e) {
        e.preventDefault();
        const data = {
            id: props.data.id,
            platform, username, password
        }
        axios({
            method: 'put',
            url: '/credentials',
            contentType: 'application/json',
            responseType: 'stream',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            },
            data: data
        }).then((response) => {
            console.log(response);
            setPlatformError("")
            setPasswordError("")
            setUsernameError("")
            setEdit(false)
            // props.refresh();

        }).catch((err) => {
            console.log(err);
            //setIsProgress(false)
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
        <div className="credential">
            {
                edit ?
                    <form onSubmit={updateCrential} className="updateCredForm">
                        <div className="updateCredentialFormHeader">
                            <h3>Update Credential</h3>
                        </div>
                        <div className="addCredentialFormInput updateCredentialFormInput">
                            <label>Platform:</label>
                            <input type="text" value={platform} onChange={(e) => setPlatform(e.target.value)} required />
                            <p>{platformError}</p>
                        </div>
                        <div className="addCredentialFormInput updateCredentialFormInput">
                            <label>Username:</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            <p>{usernameError}</p>
                        </div>
                        <div className="addCredentialFormInput updateCredentialFormInput">
                            <label>Password:</label>
                            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <p>{passwordError}</p>
                        </div>
                        <div className="updatCredentialFormbtn">
                            <button type="submit" className="update">Update</button>
                            <button onClick={() => {
                                setPlatformError("")
                                setEdit(false)
                            }} className="cancel">Cancel</button>
                        </div>
                    </form>
                    :
                    <div >
                        <div className="credential-header">
                            <p>{platform}</p>
                        </div>
                        <div className="credential-body">
                            <p className="createdddate">Added on : {createdAt}</p>
                            <p className="createdddate">Last modified : {updatedAt}</p>

                            <div className="updateCredentialData cred">
                                <label>Username:</label>
                                <p>{username}</p>
                            </div>
                            <div className="updateCredentialData cred">
                                <label>Password:</label>
                                <p>{password}</p>
                            </div>

                        </div>
                        <div className="credentialbtn">
                            <button className="editcbtn" onClick={() => setEdit(true)}><BiEdit /> Edit</button>
                            <button className="deletecbtn" onClick={openalert}><MdDelete /> Delete</button>
                        </div>
                    </div>
            }

            <div className="alert" id="alert">
                <div>

                    <p>Please confirm, Do you want to delete? </p>
                </div>
                <div>
                    <button onClick={handleDelete}>Yes</button>
                    <button onClick={closealert}>No</button>
                </div>
            </div>
        </div>
    )
}

export default Credential