import { useState } from "react"
import { Link } from "react-router-dom"

function Navbar2() {
  return (
    <header className="w-screen flex justify-between items-center px-60 flex-wrap py-2 bg-slate-950">
        <h1 className="text-3xl font-medium text-white">ChatBot</h1>
        <nav className="flex justify-center items-center flex-wrap">
           <ul className="flex justify-center items-center gap-2.5 flex-wrap">
            <li className="py-2 px-4 bg-slate-100 text-black font-medium m-2 rounded-xl"><Link to="/chat">Chat</Link></li>
            <li className="py-2 px-4 bg-slate-100 text-black font-medium m-2 rounded-xl"><Link to="/login">Login</Link></li>
            <li className="py-2 px-4 bg-slate-100 text-black font-medium m-2 rounded-xl"><Link to="/register">Register</Link></li>
           </ul>
        </nav>
    </header>
  )
}

export default Navbar2