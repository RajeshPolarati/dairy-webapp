import React, { useEffect, useState } from 'react'
import "../css/Home.css"
import Navbar from "./Navbar"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import CircularProgress from '@mui/material/CircularProgress';
import Entry from "./entry"
import { useNavigate } from 'react-router-dom';

const axios = require('axios');
const Home = (props) => {
    const [startDate, setStartDate] = useState(new Date());
    const [dateError, setDateError] = useState("")
    const [descriptionError, setDescriptionError] = useState("");
    const [description, setDescription] = useState("")
    const [edit, setEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [entries, setEntries] = useState([])
    const navigate = useNavigate()
    const [token, setIsToken] = useState(false)
    useEffect(() => {
        axios({
            method: 'get',
            url: '/dairy',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            }

        }).then((response) => {
            //console.log(response);
            setIsToken(true)
            setEntries(response.data.Entries);
            setIsLoading(false)
        }).catch((error) => {
            //console.log(error);
            if (error.response.status == 400) {
                navigate("/")
            }
        })
    })

    // function refresh() {
    //     axios({
    //         method: 'get',
    //         url: '/dairy',
    //         responseType: 'stream',
    //         headers: {
    //             Authorization: 'Bearer ' + localStorage.getItem('authToken')
    //         }
    //     }).then((response) => {
    //         console.log(response);
    //         setEntries(response.data.Entries);
    //     })
    // }

    function add(e) {
        e.preventDefault();
        console.log(startDate.toISOString().split('T')[0]);
        console.log(description);
        const data = {
            date: startDate.toISOString().split('T')[0],
            description
        }
        axios({
            method: 'post',
            url: '/dairy/create',
            contentType: 'application/json',
            responseType: 'stream',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            },
            data: data
        }).then((response) => {
            //setIsProgress(false)
            console.log(response);
            setStartDate(new Date());
            setDateError("")
            setDescriptionError("")
            setDescription("")
            //refresh();

        }).catch((err) => {
            //setIsProgress(false)
            console.log(err);
            setDateError("")
            setDescriptionError("")
            if (err.response.status == 500) {
                setDateError("Already there is an entry with this date!")
            }
            if (err.response.data.errors) {
                const errors = err.response.data.errors;
                for (let i = 0; i < errors.length; i++) {

                    switch (errors[i].param) {
                        case "description": setDescriptionError(errors[i].msg)
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
                        <div className="showentries">
                            <div className="addentryForm">
                                <div className="addentryFormHeader">
                                    <h2>Add Entry</h2>
                                </div>
                                <form onSubmit={add}>
                                    <div className="addentryFormInput">
                                        <label>Choose Date:</label>
                                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                                        <p>{dateError}</p>
                                    </div>
                                    <div className="addentryFormInput">
                                        <label>Add Description:</label>
                                        <textarea className="description" cols="100" rows="6"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        ></textarea>
                                        <p>{descriptionError}</p>
                                    </div>
                                    <div className="addentryFormbtn">
                                        <button type="submit">Add to diary</button>
                                    </div>
                                </form>
                            </div>
                            <div className="allentries">
                                {
                                    isLoading ?
                                        <div style={{ width: "100%", textAlign: "center" }}>
                                            <CircularProgress size="3rem" style={{ color: "blue", marginTop: "3px" }} />
                                        </div>
                                        : entries.length == 0 ?
                                            <div className="NoEntries">
                                                <p>
                                                    No Entries
                                                </p>
                                            </div>
                                            :

                                            entries.map((entry) => (
                                                <Entry data={entry} />
                                            ))

                                }

                            </div>
                        </div>
                    </div> : ""
            }

        </div>
    )
}

export default Home