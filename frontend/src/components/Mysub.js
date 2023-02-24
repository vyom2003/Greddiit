import React, { useState, useEffect } from 'react'
import { AiOutlinePlusCircle } from "react-icons/ai"
import { Navigate, useNavigate } from 'react-router-dom'
import SubItem from './SubItem';
export default function Mysub(props) {
  const navigate = useNavigate()
  const [newG, setNewG] = useState(0);
  const [flag_emp, setEmp] = useState(0);
  const [message, setMessage] = useState("Fill all Fields")
  const [my, setmy] = useState([])
  const HandleCreate = () => {
    setNewG(1 - newG);
    setEmp(0);
  }
  const [name,setn] =useState("")
  const [d,setd] =useState("")
  const [tags,settags] =useState("")
  const [ban,setban] =useState("")

  useEffect(() => {
    (async function () {
      let data = {
        id: localStorage.getItem("User")
      }
      try {
        const response = await fetch("http://localhost:3001/mysub", {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })
        const variable = await response.json()
        setmy(variable)
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  const HandleN=(e)=>{
    setn(e.target.value)
  }
  const HandleD=(e)=>{
    setd(e.target.value)
  }
  const HandleT=(e)=>{
    settags(e.target.value)
  }
  const HandleB=(e)=>{
    setban(e.target.value)
  }
  const CheckDisable=()=>{
    if(name===""||d===""||tags===""||ban==="")
    {
      return true;
    }
    else return false;
  }
  const CreateNew = async (e) => {
    e.preventDefault();
    if (document.getElementById("subname").value === "" || document.getElementById("subdesc").value === "" || document.getElementById("subtag").value === "" || document.getElementById("subban").value === "") {
      setEmp(1);
      setMessage("Fill all Fields")
    }
    else {
      let data = {
        id: localStorage.getItem("User"),
        name: document.getElementById("subname").value,
        desc: document.getElementById("subdesc").value,
        tags: document.getElementById("subtag").value,
        ban: document.getElementById("subban").value
      };
      const response = await fetch("http://localhost:3001/mysub", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (response.status === 200) {
        alert("SubGreddit Created");
      }
      else {
        setEmp(1);
        setMessage(response.body.message)
      }
      setEmp(0);
      setNewG(1 - newG);
      window.location.reload(false)
    }
  }
  if (!localStorage.getItem("User")) {
    return (
      <Navigate to="/" replace={true} state={{ from: "/profile" }} />
    )
  }
  else {
    props.changeState(0);
    return (
      <div id="mysub">
        <h1>My SUBGreddiits</h1>
        <div style={{ display: "flex" }}><button className="btn btn-dark" style={{ marginLeft: "auto", marginRight: "20px" }} onClick={HandleCreate}>{!newG ? (<><AiOutlinePlusCircle /><h6>Create New</h6></>) : <h6>ViewGreddits</h6>}</button></div>
        <div className="row my-3">{!newG ? (my.map((element) => {
          return <div className='col-md-4'><SubItem subname={element.name} subdesc={element.description} followers={element.followers.length} posts={element.posts.length} banned={element.bannedWords} setid={props.setid} /></div>
        })) : null}
        </div>
        {newG ? (<div>
          <div className="container" style={{ marginTop: "10px", backgroundColor: "darkslategrey", color: "white" }}>
            <br /><h1>Create New SubGreddit</h1>
            {flag_emp ? <p style={{ color: "red" }}>{message}</p> : null}
            <form style={{ marginTop: "10px", textAlign: "left" }} onSubmit={CreateNew}>
              <div className="mb-3">
                <label htmlFor="subname" className="form-label">Name</label>
                <input type="text" value={name} onChange={HandleN} className="form-control" id="subname" placeholder="Enter Name" />
              </div>
              <div className="mb-3">
                <label htmlFor="subdesc" className="form-label">Description</label>
                <textarea rows="4" cols="50" value={d} onChange={HandleD} type="text" className="form-control" id="subdesc" placeholder="Enter Description" />
              </div>
              <div className="mb-3">
                <label htmlFor="subtags" className="form-label">Tags</label>
                <input type="text" value={tags} onChange={HandleT} className="form-control" id="subtag" placeholder="Enter Tags" />
              </div>
              <div className="mb-3">
                <label htmlFor="subban" className="form-label">Banned Keywords</label>
                <input type="text" value={ban} onChange={HandleB} className="form-control" id="subban" placeholder="Enter Banned Keywords" />
              </div>
              <button disabled={CheckDisable()} type="submit" className="btn btn-primary">Create</button>
            </form>
            <br />
          </div>
          <br /><br />
        </div>) : null}
      </div>
    )
  }
}
