import React, { useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi"
import "../css/test.css"
import { useNavigate } from 'react-router-dom';
const axios = require('axios');
const Entry = (props) => {
    const navigate = useNavigate()
    const [startDate, setStartDate] = useState(new Date());
    const [dateError, setDateError] = useState("")
    const [descriptionError, setDescriptionError] = useState("");
    const [description, setDescription] = useState("")
    const [edit, setEdit] = useState(false)
    const [createdAt, setCreatedAt] = useState("")
    const [updatedAt, setUpdateddAt] = useState("")
    const [date, setDate] = useState("")
    const [autoUpdate, setAutoUpdate] = useState("")
    const [isUpdateClicked, setIsUpdateClicked] = useState(false)
    const [file, setFile] = useState();
    useEffect(() => {
        setDate(convert(props.data.date).split(" ")[0])
        setCreatedAt(convert(props.data.createdAt))
        setUpdateddAt(convert(props.data.updatedAt))
        setDescription(props.data.description)
        setStartDate(new Date(props.data.date))
        console.log("props");
        console.log(props);
    }, [props])
    function convert(value) {
        var options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        };
        let localDate2 = new Date(value).toLocaleString('en', options).split(",")
        let dates = localDate2[0].split("/")
        let finalDate = [dates[1], dates[0], dates[2]].join("/") + localDate2[1]
        return finalDate
    }

    function updateEntry(e) {
        e.preventDefault()
        setDateError("")
        setDescriptionError("")
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", props.data.id);
        formData.append("description", description);
        axios({
            method: 'put',
            url: '/dairy/',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            },
            data: formData
        })
            .then((response) => {
                // console.log(response);
                props.refresh();
                isUpdateClicked ? (() => {
                    setEdit(false)
                    setIsUpdateClicked(false);
                    clearInterval(autoUpdate)
                })()
                    : (() => { })()
            }).catch((err) => {
                //console.log(err);

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
            props.refresh()

        }).catch((err) => {
            console.log(err);

        });
    }
    return (
        <div className="entryUpdateMain">
            <div className="entry">
                {
                    edit ? <form onSubmit={updateEntry} name="updateform">
                        <div className="addentryFormHeader">
                            <h2>Update Entry</h2>
                        </div>
                        <div className="addentryFormInput updateEntryInput">
                            <label>Date:</label>
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} readOnly={true} />
                            <p>{dateError}</p>
                        </div>
                        <div className="addentryFormInput updateEntryInput" >
                            <label >Update Image:</label>
                            <input type="file" accept="image/*" onChange={(e) => {
                                setFile(e.target.files[0])
                            }} />
                        </div>
                        <div className="addentryFormInput updateEntryInput">
                            <label>Edit Description:</label>
                            <textarea className="description" cols="100" rows="6" value={description} onChange={(e) => {
                                setDescription(e.target.value)
                            }}></textarea>
                            <p>{descriptionError}</p>
                        </div>
                        <div className="updatentryFormbtn">
                            <button type="submit" id="update" onClick={(e) => {
                                e.isTrusted ? setIsUpdateClicked(true) : setIsUpdateClicked(false);
                            }} className="update">Update</button>
                            <button onClick={() => {
                                setDateError("")
                                setDescriptionError("")
                                setEdit(false)
                                clearInterval(autoUpdate)
                            }} className="cancel">Cancel</button>
                        </div>
                    </form> :
                        <div className="entry-data">
                            <h4 className="entrydate">Date : {date}</h4>
                            <p className="createddate">Added on : {createdAt}</p>
                            <p className="createddate">Last modified : {updatedAt}</p>
                            <p className="entrydescp">{props.data.description}</p>
                            <div className="imglink">
                                <p>Added Image : {props.data.image ? props.data.image : "No Image"} </p>
                                {props.data.image ? <FiExternalLink style={{ cursor: "pointer", marginLeft: "1px", color: "blue" }} onClick={() => { navigate("/img", { state: { imagePath: props.data.image } }) }} /> : ""}

                            </div>

                            <div className="entrybtn">
                                <button className="editbtn" onClick={() => {
                                    setEdit(true)
                                    setAutoUpdate(setInterval(() => document.getElementById('update').click(), 15000))
                                }}><BiEdit /> Edit</button>
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