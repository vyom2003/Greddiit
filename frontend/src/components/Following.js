import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Followitem from './Followitem'
export default function Following(props) {
  let data = {
    id: localStorage.getItem("User")
  };
  const [following, setFollowing] = useState([])
  const HandleRemove = (a) => {
    const send = {
      id: localStorage.getItem("User"),
      email: a
    }
    fetch("http://localhost:3001/profile/following", {
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
        const response = await fetch("http://localhost:3001/profile/following", {
          method: "post",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        variable = await response.json()
        setFollowing(variable.following)
      } catch (e) {
        console.error(e);
      }
      console.log(variable)
    })();
  }, []);
  if (!localStorage.getItem("User")) {
    return (
      <Navigate to="/" replace={true} state={{ from: "/profile/following" }} />
    )
  }
  else {
    props.changeState(0);
    return (
      <div className="container" id="following">
        <h1 style={{ "textAlign": "center" }}>Following:</h1>
        {following.map((element) => {
          return <div className='col-md-4'><Followitem HandleRemove={HandleRemove} followers={following} changeArr={setFollowing} email={element} /></div>
        })}
      </div>
    )
  }
}