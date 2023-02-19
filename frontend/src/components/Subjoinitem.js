import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Subjoinitem = (props) => {
    const [isActive, setIsActive] = useState(false);
    const navigate =useNavigate();
    const LeaveSub = async () => {
        let data={
            id:localStorage.getItem("User"),
            sub_name:props.name
        }
        const response = await fetch("http://localhost:3001/sub/leave", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        })
        if(response.status===200)
        {
            window.alert("Left Successfully")
            window.location.reload(false)
        }
        else if(response.status===400){
            window.alert("You are moderator")
        }
    }
    const JoinSub = async () => {
        let data={
            id:localStorage.getItem("User"),
            sub_name:props.name
        }
        const response = await fetch("http://localhost:3001/sub/join", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        })
        if(response.status===200)
        {
            window.alert("Request sent Successfully")
            window.location.reload(false)
        }
        else if(response.status===400){
            window.alert("You are not allowed to join")
        }
        else{
            window.alert("Request already pending")
        }
    }
    const OpenSub =async ()=> {
        let data = {
            name: props.name
        }
        await fetch("http://localhost:3001/visit", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        let path= "./" +(props.name) 
        navigate(path)
    }
    return (
            <div className="accordion-item" style={{ backgroundColor: "black", marginLeft: "45%", width: "350px" }}>
                <div className="btn btn-dark" onClick={() => setIsActive(!isActive)} >
                    <div>{props.name}{" "} {isActive ? '-' : '+'}</div>
                </div>
                {isActive && <div className="accordion-content" style={{ backgroundColor: "darkslategrey", color: "white" }}>
                    <p>Description: {props.desc}</p>
                    <p>Followers: {props.followers}</p>
                    <p> No. of Posts: {props.posts}</p>
                    <p>Banned Keywords: {props.banned}</p>
                    {props.flag ? (<button disabled={props.moderator===props.id.id} onClick={LeaveSub}>Leave</button>) : (<button onClick={JoinSub}>Join</button>)}
                    {props.flag ? <button onClick={OpenSub}>Open Subgreddiit</button>:null}
                </div>}
            </div>
        );
    };

    export default Subjoinitem;