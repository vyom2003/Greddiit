import React, { useState,useEffect } from 'react'
import { AiOutlineArrowRight } from 'react-icons/ai'
export default function CommentItem(props) {
    const [nest, setNest] = useState([])
    const [com, setCom] = useState(0)
    const [num,setnum] =useState(0)
    const [Change_num,setChange]=useState(true)
    const NestComments = async () => {
        setCom(1 - com)
        let data = {
            postid: props.postid,
            comment_content: null,
            id: localStorage.getItem("User"),
            parent: props.comment_id
        }
        const response = await fetch("http://localhost:3001/addnest", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        let variable = await response.json()
        console.log(variable)
        setNest(variable.children)
        setContent("")
    }
    const [comContent, setContent] = useState("")
    const AddComment = async () => {
        let data = {
            postid: props.postid,
            comment_content: comContent,
            id: localStorage.getItem("User"),
            parent: props.comment_id
        }
        const response = await fetch("http://localhost:3001/addnest", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        let variable = await response.json()
        console.log(variable)
        setNest(variable.children)
        setChange(!Change_num)
        setContent("")
    }
    useEffect(() => {
        (async function () {
            try {
                let data={
                    id:props.comment_id
                }
                const response = await fetch("http://localhost:3001/getnum", {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify(data)
                })
                let variable= await response.json()
                setnum(variable.num)
            } catch (e) {
                console.error(e);
            }
        })();
    }, [Change_num]);
    return (
        <div className="card" style={{ "width": "95%", marginLeft: props.margin + "px", marginTop: "0px", marginBottom: "0px", backgroundColor: "pink", fontSize: "15px" }}>
            <div className="card-body">
                <div style={{ textAlign: "left" }}><strong>{props.name}</strong>{" "}<AiOutlineArrowRight />{" "}{props.content}</div>
                <button className="btn btn-dark" onClick={NestComments}>{num} Comment</button>
            </div>
            {com ? <div><textarea value={comContent} onChange={(e) => { setContent(e.target.value) }} placeholder="Enter Comment" style={{ width: "70%", marginLeft: "0px", marginTop: "10px", height: "50px", fontSize: "15px" }}></textarea><br />
                <button style={{ height: "30px" }} onClick={AddComment}>Add</button><br /><br />
                {
                    nest.map((element) => {
                        return (
                            <div><CommentItem name={element.user} content={element.content} comment_id={element._id} postid={props.postid} margin={props.margin} /></div>
                        )
                    })
                }
            </div> : null}
        </div>
    )
}
