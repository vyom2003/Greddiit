import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AiFillEdit } from 'react-icons/ai'
export default function Edit(props) {
    const navigate = useNavigate()
    const [r_fname, setRf] = useState(localStorage.getItem("fn") ? localStorage.getItem("fn") : "")
    const [r_lname, setRl] = useState(localStorage.getItem("ln") ? localStorage.getItem("ln") : "")
    const [r_age, setRa] = useState(localStorage.getItem("ag") ? localStorage.getItem("ag") : "")
    const [r_contact, setRc] = useState(localStorage.getItem("cn") ? localStorage.getItem("cn") : "")
    const [ifname, setif] = useState("")
    const [ilname, setil] = useState("")
    const [iage, setia] = useState("")
    const [icontact, setic] = useState("")
    const HandleRF = (e) => {
        setRf(e.target.value);
        localStorage.setItem("fn", e.target.value)
    }
    const HandleRl = (e) => {
        localStorage.setItem("ln", e.target.value)
        setRl(e.target.value);
    }
    const HandleRa = (e) => {
        localStorage.setItem("ag", e.target.value)
        setRa(e.target.value);
    }

    const HandleRc = (e) => {
        setRc(e.target.value);
        localStorage.setItem("cn", e.target.value)
    }
    const CheckDisable = () => {
        if (r_fname === "" || r_lname === "" || r_age === "" || r_contact === "" ||
            Number(r_age) < 18 || r_contact.toString().length != 10) {
            return true;
        }
        else return false;
    }
    window.onpopstate = (e) => {
        if (props.editState === 1&& e.target.location.href==="http://localhost:3000/profile" && (ifname !== r_fname || ilname !== r_lname || iage !== r_age || icontact !== r_contact)) {
            props.setEdit(0);
            let answer = prompt("Do you Want to Go Back.(Y/N)")
            if (answer === 'Y' || answer == 'y') {
                localStorage.removeItem("fn")
                localStorage.removeItem("ln")
                localStorage.removeItem("ag")
                localStorage.removeItem("cn")
                navigate(0)
            }
            else {
                navigate(1)
            }
        }
        else if(e.target.location.href=="http://localhost:3000/profile/edit")
        {
            ;
        }
        else if(props.editState==1) {
            props.setEdit(0);
            localStorage.removeItem("fn")
            localStorage.removeItem("ln")
            localStorage.removeItem("ag")
            localStorage.removeItem("cn")
        }
    }
    useEffect(() => {
        (async function () {
            try {
                const response = await fetch("http://localhost:3001/profile", {
                    method: "get",
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer ' + localStorage.getItem("User")
                    }
                })
                const variable = await response.json()
                if (!localStorage.getItem("fn")) {
                    setRf(variable.fname)
                }
                setif(variable.fname)
                if (!localStorage.getItem("ln")) {
                    setRl(variable.lname)
                }
                setil(variable.lname)
                if (!localStorage.getItem("ag")) {
                    setRa(variable.age)
                }
                setia(variable.age)
                if (!localStorage.getItem("cn")) {
                    setRc(variable.Contact_num)
                }
                setic(variable.Contact_num)
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);
    const HandleEdit = async (e) => {

        e.preventDefault()
        let data = {
            id: localStorage.getItem("User"),
            fname: document.getElementById("fname").value,
            lname: document.getElementById("lname").value,
            age: document.getElementById("Age").value,
            Contact_num: document.getElementById("contact").value
        }
        const response = await fetch("http://localhost:3001/profile/edit", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.status === 200) {
            navigate("/profile");
        }
        else {
            window.alert("Couldn't Update")
        }
    }
    if (!localStorage.getItem("User")) {
        return (
            <Navigate to="/" replace={true} state={{ from: "/profile/edit" }} />
        )
    }
    else {
        props.changeState(0);
        props.setEdit(1);
        return (
            <div id="editPage">
                <h1 style={{ "textAlign": "center" }}><AiFillEdit />EDIT PROFILE</h1>
                <div className="container" style={{ marginTop: "100px", backgroundColor: "darkslategrey", color: "white" }}>
                    <form style={{ marginTop: "0px" }} onSubmit={HandleEdit}>
                        <div className="mb-3">
                            <label htmlFor="fname" className="form-label">First Name</label>
                            <input type="text" value={r_fname} onChange={HandleRF} className="form-control" id="fname" placeholder="Enter First Name" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lname" className="form-label">Last Name</label>
                            <input type="text" value={r_lname} onChange={HandleRl} className="form-control" id="lname" placeholder="Enter Last Name" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Age" className="form-label">Age</label>
                            <input type="number" value={r_age} onChange={HandleRa} className="form-control" id="Age" placeholder="Enter your Age" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="contact" className="form-label">Contact Number</label>
                            <input type="number" value={r_contact} onChange={HandleRc} className="form-control" id="contact" placeholder="Enter Contact Number" />
                        </div>
                        <button disabled={
                            CheckDisable()
                        } type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            </div>
        )
    }
}
