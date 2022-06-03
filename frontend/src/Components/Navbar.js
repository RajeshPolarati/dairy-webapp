import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = (props) => {
    const navigate = useNavigate()
    function handleLogout() {
        localStorage.removeItem('authToken')
        navigate("/")
    }
    return (
        <div className="navbar">
            <ul>
                <li className={props.selected == "home" ? "active" : ""}><Link to="/home">Show Entries</Link></li>
                <li className={props.selected == "credentials" ? "active" : ""}><Link to="/credentials">Show Credentials</Link></li>
            </ul>
            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}

export default Navbar