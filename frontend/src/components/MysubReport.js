import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import ReportItem from './ReportItem';
export default function MysubReport(props) {
  let { id } = useParams();
  const navigate=useNavigate()
  const [sub, setsub] = useState()
  const [posts, setposts] = useState()
  const [users, setusers] = useState()
  const [done, setdone] = useState(0)
  const [flg, setflg] = useState(0)
  const handleKeyPress = useCallback((event) => {
    if (event.key === 'j') {
      navigate(`/mysub/${id}/join`);
    }
    else if (event.key === 'r') {
      navigate(`/mysub/${id}/reports`);
    }
    else if (event.key === 's') {
      navigate(`/mysub/${id}/stats`);
    }
    else if (event.key === 'u') {
      navigate(`/mysub/${id}/`);

    }
  }, []);
  const ReportsGenerate = () => {
    let arr = []
    for (let i of posts) {
      for (let j of sub.reports) {
        if (j.post_id === i._id) {
          let obj = {
            post_id: i._id,
            content: i.content,
            by: j.by,
            reason: j.reason,
            user: i.user,
            action: j.action,
            report_id: j._id
          }
          arr.push(obj)
        }
      }
    }
    arr.reverse()
    return arr
  }
  useEffect(() => {
    (async function () {
      try {
        let data = {
          name: id,
          id: localStorage.getItem("User")
        }
        const response = await fetch("http://localhost:3001/sub/" + id, {
          method: "post",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        if (response.status === 400) {
          setflg(1)
        }
        else {
          const variable = await response.json()
          setsub(variable.sub)
          setposts(variable.posts)
          setusers(variable.users)
          setflg(0);
        }
        setdone(1)
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
  if (!localStorage.getItem("User")) {
    return (
      <Navigate to="/" replace={true} state={{ from: "/profile" }} />
    )
  }
  else if (flg) {
    return (
      <div>Authorisation denied</div>
    )
  }
  else {
    props.changeState(1);
    return (
      <>
        <h1 style={{ textAlign: "center", backgroundColor: "lightcoral", margin: "20px" }}>Reports</h1>
        {done ? console.log(window.var = (ReportsGenerate())) : null}
        <div>
          {done ? (
            window.var.map((element) => {
              return (
                <ReportItem element={element}></ReportItem>
              )
            })
          ) : null}
        </div>
      </>
    )
  }
}
