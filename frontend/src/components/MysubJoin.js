import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom';
export default function MysubJoin(props) {
    let { id } = useParams();
    const [sub, setsub] = useState()
    const navigate=useNavigate()
    const [done, setdone] = useState(0)
    const [join, setJoin] = useState([])
    const [flg, setflg] = useState(localStorage.getItem("id"))
    const AcceptUser = async (user) => {
        let data = {
            user: user,
            greddiit: sub._id
        }
        const response = await fetch("http://localhost:3001/adduser", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.status === 200) {
            window.alert("User request Accepted")
            window.location.reload(false)
        }
    }
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
    const RejectUser = async (user) => {
        let data = {
            user: user,
            greddiit: sub._id
        }
        const response = await fetch("http://localhost:3001/rejectuser", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.status === 200) {
            window.alert("User request Rejectted")
            window.location.reload(false)
        }
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
                    setJoin(variable.join)
                    setflg(0)
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
            <div>
                <h1 style={{ textAlign: "center", backgroundColor: "lightcoral", margin: "20px" }}>Joining Requests</h1>
                {done ?
                    <>
                        {join.map((element) => {
                            return (
                                <>
                                    <div className="card" style={{ width: "20%", marginTop: "0px", marginLeft: "80px", marginBottom: "0px", padding: "5px" }}>
                                        <div className="card-body" style={{ padding: "5px" }}>
                                            <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">{element.username}</button>

                                            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                                                <div class="offcanvas-header">
                                                    <h5 id="offcanvasRightLabel">{element.fname + " " + element.lname}</h5>
                                                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                                </div>
                                                <div class="offcanvas-body">
                                                    <ul className="list-group list-group-flush">
                                                        <li className="list-group-item">Age: {element.age}</li>
                                                        <li className="list-group-item">Email: {element.email} </li>
                                                        <li className="list-group-item">Contact: {element.Contact_num}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <button className="btn btn-success" style={{ marginLeft: "70px" }} onClick={async () => { AcceptUser(element) }}>Accept</button><button className="btn btn-danger" style={{ marginLeft: "10px" }} onClick={async () => { RejectUser(element) }}>Reject</button>
                                        </div>
                                    </div>
                                </>
                            )
                        })}
                    </>
                    : null}
            </div>
        )
    }
}
