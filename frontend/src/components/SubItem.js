import React from 'react'
import { BsFillArrowRightCircleFill } from 'react-icons/bs'
import { AiFillDelete } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
export default function SubItem(props) {
    const navigate = useNavigate()
    const bannedString = (a) => {
        let str = ""
        for (let i = 0; i < a.length - 1; i++) {
            str += a[i] + ","
        }
        str += a[a.length - 1]
        return str
    }
    const OpenGreddit = async () => {
        props.setid(props.subname)
        localStorage.setItem("id", props.subname)
        let data = {
            name: props.subname
        }
        await fetch("http://localhost:3001/visit", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        navigate("./" + props.subname)
    }
    const DeleteSub = async () => {
        let data = {
            name: props.subname
        }
        await fetch("http://localhost:3001/mysub", {
            method: "delete",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        window.location.reload(false)
    }
    return (
        <div>
            <div className="card" style={{ width: "18rem", margin: "30px" }}>
                <img src={require("./../subicon.png")} alt="not loading" />
                <div className="card-header">
                    <h3>{props.subname}</h3>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item"><h4>{props.subdesc}</h4></li>
                    <li className="list-group-item"><h5>Followers : </h5>{props.followers}</li>
                    <li className="list-group-item"><h5>Posts :</h5> {props.posts}</li>
                    <li className="list-group-item"><h5>Banned Words :</h5> {bannedString(props.banned)}</li>
                    <li> <button type="button" className="btn btn-dark" style={{ margin: "15px" }} onClick={DeleteSub}><AiFillDelete />{"   "}Delete</button><button type="button" className="btn btn-dark" style={{ margin: "15px" }} onClick={OpenGreddit}><BsFillArrowRightCircleFill />{"   "}More</button></li>
                </ul>
            </div>
        </div>
    )
}
