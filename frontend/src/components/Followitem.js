import React from 'react'
import { HiUserRemove } from 'react-icons/hi'
export default function Followitem(props) {
    const HandleRemove = () => {
        props.HandleRemove(props.email)
        { props.changeArr(props.followers.filter(follower => follower !== props.email)) }
    }
    return (
        <div>
            <div>
                <div className="card" style={{ width: "18rem" }}>
                    <div className="card-body">
                        <p className="card-text">{props.email}</p>
                        <button className="btn btn-sm btn-primary" onClick={HandleRemove}><HiUserRemove />{"  "}Remove</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
