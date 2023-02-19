import React, { useEffect,useState } from 'react'
import "./Profile.css"
import profile_img from '../reddit.png'
import { Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
export default function Profile(props) {
    const [fname,setf]=useState("");
    const [lname,setl]=useState("");
    const [uname,setu]=useState("");
    const [email,sete]=useState("");
    const [age,setage]=useState("");
    const [contact,setc]=useState("");
    const [numfollower,setNumFollower] =useState(0);
    const [numfollowing,setNumFollowing] =useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        (async function () {
            try {
                const response = await fetch("http://localhost:3001/profile", {
                    method: "get",
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer ' + localStorage.getItem("User")
                    }
                })
                const variable = await response.json()
                setf(variable.fname)
                setl(variable.lname)
                setu(variable.username)
                setage(variable.age)
                sete(variable.email)
                setc(variable.Contact_num)
                setNumFollower(variable.followers.length)
                setNumFollowing(variable.following.length)
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);
    const HandleEdit=()=>
    {
        navigate("./edit");
    }
    if (!localStorage.getItem("User")) {
        return (
            <Navigate to="/" replace={true} state={{ from: "/profile" }} />
        )
    }
    else {
        props.changeState(0);
        return (
            <>
                <div className='profile'>
                    <div className="header-image">
                    </div>
                    <div className='container'>
                        <h1 style={{ textAlign: "center" }}>Profile Page</h1>
                        <div className="card" style={{ width: "18rem", margin: "auto" }}>
                            <img src={profile_img} className="card-img-top" alt="" />
                            <div className="card-body">
                                <h5 className="card-title" style={{ textAlign: "center" }}>{fname+" "+lname}</h5>
                                <p className="card-text" style={{ textAlign: "center" }}>@{uname}</p>
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Age: {age}</li>
                                <li className="list-group-item">Email: {email} </li>
                                <li className="list-group-item">Contact: {contact}</li>
                            </ul>
                            <div className="card-body">
                                <Link to="./followers" style={{ margin: "10px" }}>Followers : {numfollower}</Link>
                                <Link to="./following" >Following : {numfollowing}</Link>
                            </div>
                        </div>
                    </div>
                    <div id="button_logout">
                        <button className="btn btn-dark" onClick={HandleEdit}>Edit Profile</button>
                    </div><br/><br/>
                </div>

            </>
        )
    }
}
