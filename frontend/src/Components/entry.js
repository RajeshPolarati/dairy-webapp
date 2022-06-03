import React, { useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import "../css/test.css"
const axios = require('axios');
const Entry = (props) => {
    const [startDate, setStartDate] = useState(new Date());
    const [dateError, setDateError] = useState("")
    const [descriptionError, setDescriptionError] = useState("");
    const [description, setDescription] = useState("")
    const [edit, setEdit] = useState(false)
    const [createdAt, setCreatedAt] = useState("")
    const [updatedAt, setUpdateddAt] = useState("")
    const [date, setDate] = useState("")
    useEffect(() => {
        setDate(convert(props.data.date).split(",")[0])
        setCreatedAt(convert(props.data.createdAt))
        setUpdateddAt(convert(props.data.updatedAt))
        setDescription(props.data.description)
        setStartDate(new Date(props.data.date))
        console.log(new Date(props.data.date));
    }, [])
    function convert(value) {
        let localDate = new Date(value).toLocaleString().replaceAll("/", "-").split(" ")
        return localDate[0] + " " + localDate[1]
    }
    function updateEntry(e) {
        e.preventDefault();
        axios({
            method: 'put',
            url: '/dairy',
            contentType: 'application/json',
            responseType: 'stream',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            },
            data: { id: props.data.id, description: description }
        }).then((response) => {
            //setIsProgress(false)
            console.log(response);
            setEdit(false);

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
            url: `/dairy/${props.data.id}`,
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
    return (
        <div className="entryUpdateMain">
            <div className="entry">
                {
                    edit ? <form onSubmit={updateEntry}>
                        <div className="addentryFormHeader">
                            <h2>Update Entry</h2>
                        </div>
                        <div className="addentryFormInput updateEntryInput">
                            <label>Choose Date:</label>
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                            <p>{dateError}</p>
                        </div>
                        <div className="addentryFormInput updateEntryInput">
                            <label>Edit Description:</label>
                            <textarea className="description" cols="100" rows="6" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                            <p>{descriptionError}</p>
                        </div>
                        <div className="updatentryFormbtn">
                            <button type="submit" className="update">Update</button>
                            <button onClick={() => {
                                setDateError("")
                                setDescriptionError("")
                                setEdit(false)
                            }} className="cancel">Cancel</button>
                        </div>
                    </form> :
                        <div className="entry-data">
                            <h4 className="entrydate">Date : {date}</h4>
                            <p className="createddate">Added on : {createdAt}</p>
                            <p className="createddate">Last modified : {updatedAt}</p>
                            <p className="entrydescp">{props.data.description}</p>
                            <div className="entrybtn">
                                <button className="editbtn" onClick={() => setEdit(true)}><BiEdit /> Edit</button>
                                <button className="deletebtn" onClick={openalert}><MdDelete /> Delete</button>
                            </div>
                        </div>
                }

            </div>
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

export default Entry