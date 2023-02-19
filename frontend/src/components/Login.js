import React, { useState } from 'react'
import './Login.css'
import { useNavigate, Navigate } from 'react-router-dom';
export default function Login(props) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [flag_err, setFlag_err] = useState(0);
  const [flag_emp, setFlag_emp] = useState(0);
  const navigate = useNavigate();
  const [r_fname,setRf] =useState("")
  const [r_lname,setRl] =useState("")
  const [r_uname,setRu] =useState("")
  const [r_email,setRe] =useState("")
  const [r_age,setRa] =useState("")
  const [r_contact,setRc] =useState("")
  const [r_pass,setRp] =useState("")
  const HandleEmail = (e) => {
    setEmail(e.target.value);
  }
  const HandlePass = (e) => {
    setPass(e.target.value);
  }
  const HandleRF = (e) => {
    setRf(e.target.value);
  }
  const HandleRl = (e) => {
    setRl(e.target.value);
  }

  const HandleRu = (e) => {
    setRu(e.target.value);
  }
  const HandleRe = (e) => {
    setRe(e.target.value);
  }
  const HandleRa = (e) => {
    setRa(e.target.value);
  }

  const HandleRc = (e) => {
    setRc(e.target.value);
  }
  const HandleRp = (e) => {
    setRp(e.target.value);
  }
  const HandleRegister = async (e) => {
    e.preventDefault()
    if (document.getElementById("fname").value === "" || document.getElementById("lname").value === "" || document.getElementById("uname").value === "" || document.getElementById("Email").value === ""
      || document.getElementById("Age").value === "" || document.getElementById("contact").value === "" || document.getElementById("pass").value === "") {
      setFlag_emp(1);
    }
    else {
      setFlag_emp(0);
      let data = {
        email: document.getElementById("Email").value,
        password: document.getElementById("pass").value,
        fname: document.getElementById("fname").value,
        lname: document.getElementById("lname").value,
        age: document.getElementById("Age").value,
        username: document.getElementById("uname").value,
        Contact_num: document.getElementById("contact").value
      };
      const response = await fetch("http://localhost:3001/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (response.status === 200) {
        props.setFlag(0);
      }
      else {
        setFlag_emp(1);
      }
    }
  }
  const CheckDisable = () => {
    if(r_fname===""||r_lname===""||r_email===""||r_age===""||r_contact===""||r_uname===""||r_pass===""||
    Number(r_age)<18||r_contact.toString().length!=10||!r_email.includes('@')||!r_email.includes('.'))
    {
      return true;
    }
    else return false;
  }
  const HandleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      email: email,
      password: pass
    }
    const response = await fetch("http://localhost:3001/", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (response.status === 200) {
      const variable = await response.json()
      console.log(variable)
      setEmail("");
      setPass("");
      setFlag_err(0);
      localStorage.setItem("User", variable.token);
      navigate('/home');
    }
    else {
      setEmail("");
      setPass("");
      setFlag_err(1);
    }
  }
  if (localStorage.getItem("User")) {
    return (
      <Navigate to="./profile" replace={true} state={{ from: "/" }} />
    )
  }
  else if (props.flag_l === 1) {
    props.changeState(0);
    return (
      <div className="login">
        <div className="container" style={{ marginTop: "100px", backgroundColor: "darkslategrey", color: "white" }}>
          <h1>Register Here !!</h1>
          {flag_emp ? <p style={{ color: "red" }}>Couldn't Register</p> : null}
          <form style={{ marginTop: "30px" }} onSubmit={HandleRegister}>
            <div className="mb-3">
              <label htmlFor="fname" className="form-label" >First Name</label>
              <input type="text" className="form-control" value={r_fname} onChange={HandleRF} id="fname" placeholder="Enter First Name" />
            </div>
            <div className="mb-3">
              <label htmlFor="lname" className="form-label">Last Name</label>
              <input type="text" className="form-control" id="lname" value={r_lname} onChange={HandleRl}placeholder="Enter Last Name" />
            </div>
            <div className="mb-3">
              <label htmlFor="uname" className="form-label">UserName</label>
              <input type="text" className="form-control" id="uname" value={r_uname} onChange={HandleRu} placeholder="Enter UserName" />
            </div>
            <div className="mb-3">
              <label htmlFor="Email" className="form-label">Email address</label>
              <input type="email" className="form-control" id="Email" value={r_email} onChange={HandleRe} placeholder="Enter an Email" />
            </div>
            <div className="mb-3">
              <label htmlFor="Age" className="form-label">Age</label>
              <input type="number" className="form-control" id="Age" value={r_age} onChange={HandleRa} placeholder="Enter your Age" />
            </div>
            <div className="mb-3">
              <label htmlFor="contact" className="form-label">Contact Number</label>
              <input type="number" className="form-control" id="contact" value={r_contact} onChange={HandleRc} placeholder="Enter Contact Number" />
            </div>
            <div className="mb-3">
              <label htmlFor="pass" className="form-label">Password</label>
              <input type="password" className="form-control" id="pass" value={r_pass} onChange={HandleRp} placeholder="Enter your password" />
            </div>
            <button disabled={
              CheckDisable()
            } type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    )
  }
  else {
    return (
      <div className="login">
        <div className='container' style={{ marginTop: "100px", backgroundColor: "darkslategrey", color: "white" }}>

          <h1>Login Here!!</h1>
          {flag_err ? <p style={{ color: "red" }}>Incorrect Email/Password</p> : null}
          <form style={{ marginTop: "30px" }} onSubmit={HandleSubmit}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
              <input type="text" value={email} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={HandleEmail} />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input type="password" className="form-control" value={pass} id="exampleInputPassword1" onChange={HandlePass} />
            </div>
            <button disabled={email === "" || pass === ""} type="submit" className="btn btn-primary" style={{ margin: "20px" }}>Submit</button>
          </form>
        </div>
      </div>
    )
  }
}
