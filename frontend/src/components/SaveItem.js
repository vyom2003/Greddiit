import React, { useState, useEffect } from 'react'
import { GoReport } from 'react-icons/go'
import { AiFillLike, AiFillDislike, AiOutlineComment, AiOutlineLike, AiOutlineDislike } from 'react-icons/ai'
import { BsSave } from 'react-icons/bs'
import CommentItem from './CommentItem';
export default function SaveItem(props) {
    const [done, setdone] = useState(0)
    const [liked, setLiked] = useState(0);
    const [disliked, setDisliked] = useState(0);
    const [posts, setPosts] = useState()
    const [com, setCom] = useState(0);
    const LikePost = async () => {
        if (liked === 1) {
            let data = {
                postid: props.post_id,
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
                postid: props.post_id,
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
                postid: props.post_id,
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
                postid: props.post_id,
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
    const HandleUnSave = async () => {
        let data = {
            postid: props.post_id,
            id: localStorage.getItem("User")
        }
        const response = await fetch("http://localhost:3001/unsavepost", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.status === 200)
            window.alert("Post Removed from Saved")
        window.location.reload(false)
    }
    const AddComment = async () => {
        let data = {
            postid: props.post_id,
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
            follow: posts.user,
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
    useEffect(() => {
        (async function () {
            try {
                let data = {
                    postid: props.post_id
                }
                const response = await fetch("http://localhost:3001/getpost", {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                const variable = await response.json()
                setPosts(variable.posts)
                let data2 = {
                    postid: props.post_id,
                    id: localStorage.getItem("User")
                }
                const response2 = await fetch("http://localhost:3001/findlike", {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data2)
                })
                const variable2 = await response2.json()
                setLiked(variable2.liked)
                setDisliked(variable2.disliked)
                setdone(1);
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);
    return (
        <div>
            {done ?<div>
                <div className="card" style={{ "width": "80%", marginLeft: "155px", marginTop: "20px", backgroundColor: "lightgreen" }}>
                    <div className="card-body">
                        <h5 style={{ textAlign: "left" }} className="card-title">{posts.user}{" "}<button className="btn btn-secondary" onClick={FollowUser}>Follow</button></h5>
                        <ul className="list-group" style={{ textAlign: "left" }}>
                            <li className="list-group-item">{posts.content}</li>
                        </ul>
                        <button className="btn btn-secondary" style={{ margin: "10px" }} onClick={LikePost}>{liked ? <><AiFillLike />{" "}{posts.likes.length}</> : <><AiOutlineLike />{" "}{posts.likes.length}</>}</button >
                        <button className="btn btn-secondary" style={{ margin: "10px" }} onClick={DislikePost}>{disliked ? <><AiFillDislike />{" "}{posts.dislikes.length}</> : <><AiOutlineDislike />{" "}{posts.dislikes.length}</>}</button>
                        <button className="btn btn-secondary" style={{ margin: "10px" }}><GoReport />{" "}Report</button>
                        <button className="btn btn-secondary" style={{ margin: "10px" }} onClick={HandleComments}><AiOutlineComment />{" "}Comments</button>
                        <button className="btn btn-secondary" style={{ margin: "10px" }} onClick={HandleUnSave}><BsSave />{" "}UnSave</button>
                    </div>
                </div>
                {com ? <div><textarea id="addComment" placeholder="Enter Comment" style={{ width: "70%", marginLeft: "0px", marginTop: "10px", height: "50px", fontSize: "15px" }}></textarea><br />
                    <button style={{ height: "30px" }} onClick={AddComment}>Add</button><br /><br />
                    {
                        posts.comments.filter(post=>{
                            if(post.parent===null)
                            return true;
                            else return false
                        }).map((element) => {
                            return (
                                <div><CommentItem name={element.user} content={element.content} margin={15} postid={props.post_id} comment_id={element._id}/></div>
                            )
                        })
                    }
                </div> : null}
            </div>:null}
        </div>
    )
}
