import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
export default function MysubStat() {
  let { id } = useParams()
  const navigate = useNavigate()
  const [flg, setflg] = useState(0)
  const [stats, setStats] = useState([])
  const [done, setDone] = useState(0)
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
  useEffect(() => {
    (async function () {
      try {
        let data = {
          name: id,
          id: localStorage.getItem("User"),
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
          setStats(variable.sub.stats)
        }
        setDone(1)
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
    return (
      <>
        <h1 style={{ textAlign: "center", backgroundColor: "lightcoral", margin: "20px" }}>Stats</h1>
        <div>
          {done ? <div style={{ marginLeft: "35%" }}>
            <h5 style={{ textAlign: "center", width: "15%", backgroundColor: "lightcoral", margin: "20px" }}>NUMBER OF VISITS</h5>
            <LineChart width={500} height={300} data={stats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="grey" />
              <XAxis dataKey="date" stroke="black" />
              <YAxis dataKey="num_visits" stroke="black" />
              <Tooltip />
              <Line type="monotone" strokeWidth="2" dataKey="num_visits" stroke="#fa709a" activeDot={{ r: 8 }} />
            </LineChart>
          </div>
            : null}
        </div>
        <div>
          {done ?
            <div style={{ marginLeft: "35%" }}>
              <h5 style={{ textAlign: "center", width: "15%", backgroundColor: "lightcoral", margin: "20px" }}>NUMBER OF NEW USERS</h5>
              <LineChart width={500} height={300} data={stats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="grey" />
                <XAxis dataKey="date" stroke="black" />
                <YAxis dataKey="num_users" stroke="black" />
                <Tooltip />
                <Line type="monotone" strokeWidth="2" dataKey="num_users" stroke="#fa709a" activeDot={{ r: 8 }} />
              </LineChart>
            </div>
            : null}
        </div>
        <div>
          {done ? <div style={{ marginLeft: "35%" }}>
            <h5 style={{ textAlign: "center", width: "15%", backgroundColor: "lightcoral", margin: "20px" }}>NUMBER OF POSTS</h5>
            <LineChart width={500} height={300} data={stats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="grey" />
              <XAxis dataKey="date" stroke="black" />
              <YAxis dataKey="num_posts" stroke="black" />
              <Tooltip />
              <Line type="monotone" strokeWidth="2" dataKey="num_posts" stroke="#fa709a" activeDot={{ r: 8 }} />
            </LineChart>
          </div>
            : null}
        </div>
        <div>
          {done ?
            <div style={{ marginLeft: "35%" }}>
              <h5 style={{ textAlign: "center", width: "15%", backgroundColor: "lightcoral", margin: "20px" }}>NUMBER OF DELETES AND REPORTS</h5>
              <BarChart width={500} height={300} data={stats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="grey" />
                <XAxis dataKey="date" stroke="black" />
                <YAxis stroke="black" />
                <Bar dataKey="num_delete" barSize={20} fill="green" />
                <Bar dataKey="num_reports" barSize={20} fill="green" />
              </BarChart>
            </div>
            : null}
        </div>
      </>
    )
  }
}
