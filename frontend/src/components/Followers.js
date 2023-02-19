import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Followitem from './Followitem'
export default function Followers(props) {
  let data = {
    id: localStorage.getItem("User")
  };
  const [followers, setFollowers] = useState([])
  const HandleRemove = (a) => {
    const send = {
      id: localStorage.getItem("User"),
      email: a
    }
    fetch("http://localhost:3001/profile/followers", {
      method: "delete",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(send)
    })
  }
  var variable
  useEffect(() => {
    (async function () {
      try {
        if (!localStorage.getItem("User")) return;
        const response = await fetch("http://localhost:3001/profile/followers", {
          method: "post",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        variable = await response.json()
        setFollowers(variable.followers)
      } catch (e) {
        console.error(e);
      }
      console.log(variable)
    })();
  }, []);
  if (!localStorage.getItem("User")) {
    return (
      <Navigate to="/" replace={true} state={{ from: "/profile/followers" }} />
    )
  }
  else {
    props.changeState(0);
    return (
      <div className="container" id="followers">
        <h1 style={{ "textAlign": "center" }}>Followers:</h1>
        {followers.map((element) => {
          return <div className='col-md-4'><Followitem HandleRemove={HandleRemove} followers={followers} changeArr={setFollowers} email={element} /></div>
        })}
      </div>
    )
  }
}
