import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import SaveItem from './SaveItem';
export default function SavedPage(props) {
    const [posts, setPosts] = useState([])
    const [done,setdone] =useState(0)
    useEffect(() => {
        (async function () {
            try {
                let data = {
                    id: localStorage.getItem("User")
                }
                const response = await fetch("http://localhost:3001/findsaved", {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                const variable = await response.json()
                console.log(variable.posts)
                setPosts(variable.posts)
                setdone(1);
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
                <h1 style={{ backgroundColor: "lightblue", margin: "30px", textAlign: "center" }}>Saved Posts</h1>
                {done ? (posts.map((element) => {
                    return (
                        <>
                            <SaveItem post_id={element.post_id} />
                        </>
                    )
                })) : null}
            </div>
        )
    }
}
