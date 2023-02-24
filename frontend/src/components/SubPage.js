import React, { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { TbListDetails } from 'react-icons/tb'
import { MdOutlineCreate, MdOutlineLocalPostOffice } from 'react-icons/md'
import { AiFillBackward } from 'react-icons/ai'
import Postitem from './Postitem'
export default function SubPage(props) {
    let { id } = useParams();
    const [sub, setsub] = useState()
    const [flg, setflg] = useState()
    const [done, setdone] = useState(0)
    const [create, setCreate] = useState(0);
    const [posts, setposts] = useState([]);
    const  [con,setC] =useState("")
    const bannedString = (a) => {
        let str = ""
        for (let i = 0; i < a.length - 1; i++) {
            str += a[i] + ","
        }
        str += a[a.length - 1]
        return str
    }
    const CreatePost = () => {
        setCreate(1 - create);
    }
    const censor = (str) => {
        let flag = 0
        for (let i of sub.bannedWords) {
            var searchMask = i
            var regEx = new RegExp(searchMask, "ig");
            var replaceMask = "*";
            if (str.search(new RegExp(i, "i")) !== -1) {
                flag = 1;
                str = str.replace(regEx, replaceMask);
            }
        }
        if (flag === 1) {
            window.alert("Post contains Banned Words")
        }
        return str;
    }
    const SubmitPost = async () => {
        let str=censor(document.getElementById("postContent").value)
        let data = {
            id: localStorage.getItem("User"),
            name: sub.name,
            postContent: str
        }

        const response = await fetch("http://localhost:3001/sub/" + id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.status === 200) {
            window.alert("Posted Succesfully")
            window.location.reload(false)
            setCreate(1 - create)
        }
    }
    const HandleC=(e)=>{
        setC(e.target.value)
    }
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
                    setsub(variable.sub)
                    setposts(variable.posts)
                }
                setdone(1)
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
            <div id="subpage">
                {flg ? <div><h1>Authorisation Failed</h1></div> :
                    <div>
                        {done ?
                            <div className='container my-4'>
                                <h1 style={{ margin: "40px" }}> Welcome to The server {sub.name}</h1>
                                <a className="btn btn-dark" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" style={{ dipslay: "flex" }} aria-controls="offcanvasExample">
                                    <TbListDetails />{" "}View Details
                                </a>
                                <button className="btn btn-dark" style={{ margin: "20px" }} onClick={CreatePost}>
                                    {!create ? <><MdOutlineCreate />Create Post</> : <><AiFillBackward />{" "}Back</>}
                                </button>
                                <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel" style={{ backgroundColor: "darkslategrey", color: "white" }}>
                                    <div className="offcanvas-header">
                                        <h3 className="offcanvas-title" id="offcanvasExampleLabel" style={{ textAlign: "center" }}>{sub.name}</h3>
                                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                    </div>
                                    <div className="offcanvas-body">
                                        <img src={require("./../reddit-logo.png")} alt="not loading" style={{ width: "60%", objectFit: "contain" }} />
                                        <div>
                                            <br /><h3>{sub.description.toUpperCase()}</h3><br />
                                        </div>
                                        <ul>
                                            <li className="list-group-item"><h5>Followers : {sub.followers.length}</h5></li>
                                            <li className="list-group-item"><h5>Posts :{sub.posts.length}</h5> </li>
                                            <li className="list-group-item"><h5>Banned Words : {bannedString(sub.bannedWords)}</h5> </li>
                                        </ul>
                                    </div>
                                </div>
                            </div> : null
                        }
                        {create ? <><h1><MdOutlineLocalPostOffice />{" "}Create A Post</h1><textarea id="postContent" value={con} onChange={HandleC} placeholder="Enter Content" style={{ width: "80%", height: "200px", fontSize: "20px" }}></textarea><br /><br />
                            <button className="btn btn-secondary" disabled={con==""} style={{ margin: "10px" }} onClick={SubmitPost}>Submit</button>
                        </> : null}
                        {!create ? <>
                            {done ? (posts.map((element) => {
                                return (
                                    <>
                                        <Postitem title={element.user} content={element.content} numlike={element.likes.length} numdislike={element.dislikes.length}
                                            id={localStorage.getItem("User")} postid={element._id} comments={element.comments} />
                                    </>
                                )
                            })) : null}
                        </> : null}
                    </div>
                }
            </div>
        )
    }
}
