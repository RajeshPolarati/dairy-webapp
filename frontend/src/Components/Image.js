import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
const axios = require('axios');

const Image = () => {
    const data = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        if (data.state == null) {
            navigate("/")
        } else {
            async function fetchData() {
                await fetch(`dairy/getImage/${data.state.imagePath}`, {
                    method: "get",
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                }).then((res) => {
                    if (res.status == 400) {
                        return res.json();
                    } else {
                        var myImage = document.querySelector('img');
                        res.blob().then(blobResponse => {
                            console.log(blobResponse);
                            var objectURL = URL.createObjectURL(blobResponse);
                            myImage.src = objectURL;
                        })
                    }
                }).then((res) => {
                    if (res.error) {
                        navigate("/")
                    }
                })
            }
            fetchData()

        }

    }, [])
    return (
        <div>
            {
                data.state ?
                    <div style={{ margin: "50px auto 0 auto", width: "90%", textAlign: "center" }}>
                        <img style={{ height: "90vh" }} alt="addedImage" />
                    </div>
                    : ""
            }

        </div>

    )
}

export default Image