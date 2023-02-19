import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai'
export default function Chatitem(props) {
    const [chats, setChats] = useState([])
    const [message, setMessage] = useState("")
    const SendMessage = async () => {

        let data = {
            message: message,
            sender: localStorage.getItem("User"),
            reciever: props.element
        }
        const response = await fetch("http://localhost:3001/sendchat", {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        let variable = await response.json()
        setChats(variable.chats)
        setMessage("")
    }
    const HandleChange = (e) => {
        setMessage(e.target.value)
    }
    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                let data = {
                    email: props.element,
                    id: localStorage.getItem("User")
                }
                const response = await fetch("http://localhost:3001/getchats", {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                let variable = await response.json()
                setChats(variable.chats)
            } catch (e) {
                console.error(e);
            }
        },500)
        return()=>clearInterval(intervalId)
    }, []);
    return (
        <div>
            <div>
                <button className="btn btn-secondary" style={{ width: "50%", marginLeft: "25%" }} type="button" data-bs-toggle="offcanvas" data-bs-target={"#offcanvasExample"+props.element} aria-controls="offcanvasExample">
                    {props.element}
                </button>
                <div className="offcanvas offcanvas-start" style={{ width: "80%", backgroundColor: "coral" }} tabIndex="-1" id={"offcanvasExample"+props.element} aria-labelledby="offcanvasExampleLabel">
                    <div className="offcanvas-header">
                        <h5 style={{ backgroundColor: "black", marginLeft: "40%", padding: "20px", color: "white" }} className="offcanvas-title" id="offcanvasExampleLabel">{props.element}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body" style={{height:"70%",overflowY:"scroll",marginBottom:"50px"}}>
                        {
                            chats.map((element) => {
                                if (element.sender === props.element) {
                                    return (
                                        <>
                                            <span style={{ fontSize: "20px", paddingLeft: "40px", paddingRight: "40px" }} className="badge bg-secondary">{element.message}</span>
                                            <br /><br />
                                        </>
                                    )
                                }
                                else {
                                    return (
                                        <>
                                            <span style={{ float: "right", fontSize: "20px", paddingLeft: "40px", paddingRight: "40px" }} className="badge bg-primary">{element.message}</span>
                                            <br /><br />
                                        </>
                                    )
                                }
                            })
                        }
                    </div>
                    <div><input type="text" value={message} onChange={HandleChange} style={{ width: "95%", marginTop: "0px",position:"absolute", height: "4%", bottom: "0",marginRight:"20px" }} placeholder="Enter Message"></input><button style={{bottom: "0", right: "0",position:"absolute", }} className="btn btn-primary" onClick={SendMessage}><AiOutlineSend /></button></div>
                </div><br />
            </div>
        </div>
    )
}
