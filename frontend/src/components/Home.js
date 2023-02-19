import React from 'react'
import {Navigate} from 'react-router-dom'
import './Login.css'
export default function Home(props) {
  if (!localStorage.getItem("User")) {
    return (
      <Navigate to="/" replace={true} state={{ from: "/profile" }} />
    )
  }
  else {
    props.changeState(0);
    return (
      <div className="home">
        <h1 style={{ "textAlign": "center", "backgroundColor": "cyan" }}>HOME PAGE</h1>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      </div>
    )
  }
}