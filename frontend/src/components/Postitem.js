import React, { useState, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import { GoReport } from 'react-icons/go'
import { AiFillLike, AiFillDislike, AiOutlineComment, AiOutlineLike, AiOutlineDislike } from 'react-icons/ai'
import { BsSave } from 'react-icons/bs'
import CommentItem from './CommentItem';
export default function Postitem(props) {
    let {id} =useParams();
    const [liked, setLiked] = useState(0);
    const [disliked, setDisliked] = useState(0);
    const [com, setCom] = useState(0);
    const [reportForm,setForm] = useState(0)
    const LikePost = async () => {
        if (liked === 1) {
            let data = {
                postid: props.postid,
                id: localStorage.getItem("User")
            }
            await fetch("http://localhost:3001/removelike", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        }
        else {
            console.log("abc")
            let data = {
                postid: props.postid,
                id: localStorage.getItem("User")
            }
            await fetch("http://localhost:3001/addlike", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        }
        window.location.reload(false)
    }
    const DislikePost = async () => {
        if (disliked === 1) {
            let data = {
                postid: props.postid,
                id: localStorage.getItem("User")
            }
            await fetch("http://localhost:3001/removedislike", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        }
        else {
            let data = {
                postid: props.postid,
                id: localStorage.getItem("User")
            }
            await fetch("http://localhost:3001/adddislike", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        }
        window.location.reload(false)
    }
    const HandleComments = () => {
        setCom(1 - com)
    }
    const HandleSave = async () => {
        let data = {
            postid: props.postid,
            id: localStorage.getItem("User")
        }
        const response = await fetch("http://localhost:3001/savepost", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if(response.status===200)
        window.alert("Post Saved")
        else {
            window.alert("Already Saved")
        }
    }
    const AddComment = async () => {
        let data = {
            postid: props.postid,
            comment_content: document.getElementById("addComment").value,
            id: localStorage.getItem("User")
        }
        await fetch("http://localhost:3001/addcomment", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        window.location.reload(false)
    }
    const FollowUser = async () => {
        let data = {
            follow: props.title,
            id: localStorage.getItem("User")
        }
        const response = await fetch("http://localhost:3001/followUser", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.status === 200) {
            window.alert("Followed Successfully")
        }
        else if (response.status === 400) {
            window.alert("Followed Already")
        }
        else {
            window.alert("Cannot follow Self")
        }
    }
    const HandleReport=()=>{
        setForm(1-reportForm)
    }
    const ReportPost= async()=>{
        let data={
            greddiit: id,
            post_id:props.postid,
            id:localStorage.getItem("User"),
            reason:document.getElementById("report_reason").value
        }
        const response = await fetch("http://localhost:3001/reportpost", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if(response.status==200)
        {
            window.alert("Post Reported Successfully")
            setForm(0);
        }
    }
    useEffect(() => {
        (async function () {
            try {
                let data = {
                    postid: props.postid,
                    id: localStorage.getItem("User")
                }
                const response = await fetch("http://localhost:3001/findlike", {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                const variable = await response.json()
                setLiked(variable.liked)
                setDisliked(variable.disliked)
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);
    return (
        <div>
            <div className="card" style={{ "width": "80%", marginLeft: "155px", marginTop: "20px", backgroundColor: "lightgreen" }}>
                <div className="card-body">
                    <h5 style={{ textAlign: "left" }} className="card-title">{props.title}{" "}<button className="btn btn-secondary" onClick={FollowUser}>Follow</button></h5>
                    <ul className="list-group" style={{ textAlign: "left" }}>
                        <li className="list-group-item">{props.content}</li>
                    </ul>
                    <button className="btn btn-secondary" style={{ margin: "10px" }} onClick={LikePost}>{liked ? <><AiFillLike />{" "}{props.numlike}</> : <><AiOutlineLike />{" "}{props.numlike}</>}</button >
                    <button className="btn btn-secondary" style={{ margin: "10px" }} onClick={DislikePost}>{disliked ? <><AiFillDislike />{" "}{props.numdislike}</> : <><AiOutlineDislike />{" "}{props.numdislike}</>}</button>
                    <button className="btn btn-secondary" style={{ margin: "10px" }} onClick={HandleReport}><GoReport />{" "}Report</button>
                    <button className="btn btn-secondary" style={{ margin: "10px" }} onClick={HandleComments}><AiOutlineComment />{" "}Comments</button>
                    <button className="btn btn-secondary" style={{ margin: "10px" }} onClick={HandleSave}><BsSave />{" "}Save</button>
                </div>
            </div>
            {com ? <div><textarea id="addComment" placeholder="Enter Comment" style={{ width: "70%", marginLeft: "0px", marginTop: "10px", height: "50px", fontSize: "15px" }}></textarea><br />
                <button style={{ height: "30px" }} onClick={AddComment}>Add</button><br /><br />
                {
                    props.comments.filter(post=>{
                        if(post.parent===null)
                        return true;
                        else return false
                    }).map((element) => {
                        return (
                            <div><CommentItem name={element.user} content={element.content} comment_id={element._id} postid={props.postid} margin={15}/></div>
                        )
                    })
                }
            </div> : null}
            {
                reportForm?<>
                    <h5 style={{"width": "70%", marginLeft: "230px",backgroundColor:"darkslategrey",color:"white"}}>Enter your reason for report</h5>
                    <textarea id="report_reason" placeholder='Enter your Reason' style={{fontSize:"15px",width:"70%"}}></textarea><br/>
                    <button className="btn btn-dark" onClick={ReportPost}>Submit</button>
                </>:null
            }
        </div>
    )
}
