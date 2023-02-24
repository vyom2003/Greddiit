import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import Chatitem from './Chatitem';
export default function Chat(props) {
    const [mutual, setMutual] = useState([])
    useEffect(() => {
        (async function () {
            try {
                let data = {
                    id: localStorage.getItem("User")
                }
                const response = await fetch("http://localhost:3001/mutual", {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                const variable = await response.json()
                setMutual(variable.mutual)
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);
    if (!localStorage.getItem("User")) {
        return (
            <Navigate to="/" replace={true} state={{ from: "/profile" }} />
        )
    }
    else {
        props.changeState(0);
        return (
            <div>
                <h1 style={{ textAlign: "center", backgroundColor: "lightcoral", margin: "20px" }}>CHAT HERE</h1>
                {
                    mutual.map((element) => {
                        return (<Chatitem element={element}/>);
                    })
                }
            </div>
        )
    }
}
