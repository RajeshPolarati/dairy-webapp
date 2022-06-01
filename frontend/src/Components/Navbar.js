import React from 'react'

const Navbar = () => {
    return (
        <div className="navbar">
            <ul>
                <li><a href="#">Show Entries</a></li>
                <li><a href="#">Show Credentials</a></li>
            </ul>
            <button>
                Logout
            </button>
        </div>
    )
}

export default Navbar