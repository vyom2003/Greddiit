import React from 'react'
import logo from "../logo.png"
import { AiOutlineLogin, AiOutlineForm, AiFillHome } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa'
import { BiLogOutCircle } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom';
import { BsReddit, BsSave2Fill,BsFillChatSquareDotsFill } from 'react-icons/bs'
import { ImUsers } from 'react-icons/im'
import { BiStats } from 'react-icons/bi'
import { HiLogin } from 'react-icons/hi'
import { MdOutlineReportProblem } from 'react-icons/md'
export default function Navbar(props) {
    const navigate = useNavigate();
    const HandleRegister = (e) => {
        e.preventDefault();
        props.setFlag(1);
        navigate("/");
    }
    const HandleLogin = (e) => {
        e.preventDefault();
        props.setFlag(0);
        navigate("/");
    }
    const HandleProfile = (e) => {
        e.preventDefault();
        props.setFlag(0);
        navigate("/profile");
    }
    const HandleLogout = () => {
        console.log(localStorage.getItem("User"));
        localStorage.removeItem("User");
        console.log(localStorage.getItem("User"));
        navigate("/");
    }
    const HandleMySub = (e) => {
        e.preventDefault();
        props.setFlag(0);
        navigate("/mysub");
    }
    const HandleSub = (e) => {
        e.preventDefault();
        props.setFlag(0);
        navigate("/sub");
    }
    const HandleHome = (e) => {
        e.preventDefault();
        props.setFlag(0);
        navigate("/home");
    }
    const HandleSave = (e) => {
        e.preventDefault();
        props.setFlag(0);
        navigate("/savedposts");
    }
    const HandleUsers = (e) => {
        e.preventDefault();
        props.setFlag(0);
        navigate("/mysub/" + localStorage.getItem("id"))
    }
    const HandleJoin = (e) => {
        e.preventDefault();
        props.setFlag(0);
        navigate("/mysub/" + localStorage.getItem("id") + "/join")
    }
    const HandleStats = (e) => {
        e.preventDefault();
        props.setFlag(0);
        navigate("/mysub/" + localStorage.getItem("id") + "/stats")
    }
    const HandleReport = (e) => {
        e.preventDefault();
        props.setFlag(0);
        navigate("/mysub/" + localStorage.getItem("id") + "/reports")
    }
    const HandleChats = (e) => {
        e.preventDefault();
        props.setFlag(0);
        navigate("/chats")
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
                <div className="container-fluid">
                    <img src={logo} alt="" style={{ width: "25px", height: "25px" }} />
                    <a className="navbar-brand" href="/">Greddiit</a>{"   "}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {
                                (localStorage.getItem("User") === null) ?
                                    (<li className="nav-item">
                                        <a className="nav-link active" href="/" aria-current="page" onClick={HandleLogin}><AiOutlineLogin />{" "}Login</a>
                                    </li>) : null
                            }

                            {
                                (localStorage.getItem("User") === null) ?
                                    (<li className="nav-item">
                                        <a className="nav-link active" aria-current="page" href="/" onClick={HandleRegister}><AiOutlineForm />{" "}Register</a>
                                    </li>) : null
                            }
                            {
                                (localStorage.getItem("User") !== null) ?
                                    (<li className="nav-item">
                                        <a className="nav-link active" aria-current="page" href="/" onClick={HandleHome}><AiFillHome />{" "}Home</a>
                                    </li>) : null
                            }
                            {
                                (localStorage.getItem("User") !== null) ?
                                    (<li className="nav-item">
                                        <a className="nav-link active" aria-current="page" href="/" onClick={HandleProfile}><FaUserAlt />{" "}Profile</a>
                                    </li>) : null
                            }
                            {
                                (localStorage.getItem("User") !== null) ?
                                    (<li className="nav-item">
                                        <a className="nav-link active" aria-current="page" href="/" onClick={HandleMySub}><BsReddit />{" "}MySubGreddiits</a>
                                    </li>) : null
                            }
                            {
                                (localStorage.getItem("User") !== null) ?
                                    (<li className="nav-item">
                                        <a className="nav-link active" aria-current="page" href="/" onClick={HandleSub}><BsReddit />{" "}SubGreddiits</a>
                                    </li>) : null
                            }
                            {
                                (localStorage.getItem("User") !== null) ?
                                    (<li className="nav-item">
                                        <a className="nav-link active" aria-current="page" href="/" onClick={HandleSave}><BsSave2Fill />{" "}Saved Posts</a>
                                    </li>) : null
                            }
                            {
                                (localStorage.getItem("User") !== null && props.changeNav) ?
                                    (<li className="nav-item">
                                        <a className="nav-link active" aria-current="page" href="/" onClick={HandleUsers}><ImUsers />{" "}Users</a>
                                    </li>) : null
                            }
                            {
                                (localStorage.getItem("User") !== null && props.changeNav) ?
                                    (<li className="nav-item">
                                        <a className="nav-link active" aria-current="page" href="/" onClick={HandleJoin}><HiLogin />{" "}Joining Requests</a>
                                    </li>) : null
                            }
                            {
                                (localStorage.getItem("User") !== null && props.changeNav) ?
                                    (<li className="nav-item">
                                        <a className="nav-link active" aria-current="page" href="/" onClick={HandleStats}><BiStats />{" "}Stats</a>
                                    </li>) : null
                            }
                            {
                                (localStorage.getItem("User") !== null && props.changeNav) ?
                                    (<li className="nav-item">
                                        <a className="nav-link active" aria-current="page" href="/" onClick={HandleReport}><MdOutlineReportProblem />{" "}Reported</a>
                                    </li>) : null
                            }
                            {
                                (localStorage.getItem("User") !== null) ?
                                    (<li className="nav-item">
                                        <a className="nav-link active" aria-current="page" href="/" onClick={HandleChats}><BsFillChatSquareDotsFill />{" "}Chats</a>
                                    </li>) : null
                            }
                        </ul>
                        {
                            (localStorage.getItem("User") !== null) ?
                                (<div className="d-flex">
                                    <button className="btn btn-dark" onClick={HandleLogout}><BiLogOutCircle />{" "}Logout</button>
                                </div>) : null
                        }
                    </div>
                </div>
            </nav>
        </div>
    )
}
