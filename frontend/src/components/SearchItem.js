import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchItem(props) {
    const navigate=useNavigate()
    const OpenPage=()=>
    {
        navigate("./"+props.name)
    }
    return (
        <div>
            <button type="button" className="btn btn-secondary" style={{width:"645px"}} onClick={OpenPage}>{props.name}</button>
        </div>
    )
}
