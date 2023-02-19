import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import SearchItem from './SearchItem';
import { FcSearch } from 'react-icons/fc'
import Subjoinitem from './Subjoinitem';
export default function Sub(props) {
    const [subs, setsubs] = useState([])
    const [storesubs, setstore] = useState([])
    const [search_flag, setSearch_flag] = useState(0);
    const [searched, setsearched] = useState("");
    const [tagsInput, settags] = useState("")
    const [id, seti] = useState("")
    const [done, setDone] = useState(0)
    const HandleChange = (e) => {
        let str = e.target.value
        setsubs(storesubs.filter(sub => sub.name.toLowerCase().includes(str.toLowerCase())).filter(sub => {
            if (tagsInput === "") return true;
            for (let i of tagsInput.split(",")) {
                if (sub.tags.includes(i)) {
                    return true;
                }
            }
            return false;
        }))
        setsearched(e.target.value)
    }
    useEffect(() => {
        (async function () {
            try {
                const response = await fetch("http://localhost:3001/sub", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: localStorage.getItem("User")
                    })
                })
                const variable = await response.json()
                setsubs(variable.subs)
                setstore(variable.subs)
                variable.subs.reverse()
                window.dupsubs = [...variable.subs]
                setDone(1)
                seti(variable.id)
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);
    const checkCommon = (a, tags) => {
        let retval = []
        if (tags === "") {
            return a
        }
        for (let i of a) {
            for (let j of tags.split(",")) {
                if (i.tags.includes(j)) {
                    retval.push(i)
                }
            }
        }
        return retval
    }
    const HandleName = (e) => {
        setstore(storesubs.sort((a, b) => { return (a.name?.localeCompare(b.name)) }))
        setsubs(storesubs.filter(sub => sub.name.toLowerCase().includes(document.getElementById("searched_val").value.toLowerCase())).filter(sub => {
            if (tagsInput === "") return true;
            for (let i of tagsInput.split(",")) {
                if (sub.tags.includes(i)) {
                    return true;
                }
            }
            return false;
        }))
    }
    const HandleFollow = (e) => {
        setstore(storesubs.sort((a, b) => { return (b.followers.length - a.followers.length) }))
        setsubs(storesubs.filter(sub => sub.name.toLowerCase().includes(document.getElementById("searched_val").value.toLowerCase())).filter(sub => {
            if (tagsInput === "") return true;
            for (let i of tagsInput.split(",")) {
                if (sub.tags.includes(i)) {
                    return true;
                }
            }
            return false;
        }))
    }
    const HandleDate = (e) => {

        let copy = [...window.dupsubs]
        setsubs(copy.filter(sub => sub.name.toLowerCase().includes(document.getElementById("searched_val").value.toLowerCase())).filter(sub => {
            if (tagsInput === "") return true;
            for (let i of tagsInput.split(",")) {
                if (sub.tags.includes(i)) {
                    return true;
                }
            }
            return false;
        }))
    }
    const SearchEnable = () => {
        setSearch_flag(1 - search_flag);
        settags("")
        setsubs(storesubs)
    }
    const HandleTagSearch = (e) => {
        settags(document.getElementById("tagsInp").value)
        setsubs(checkCommon(storesubs, (document.getElementById("tagsInp").value)).filter(sub => sub.name.toLowerCase().includes(document.getElementById("searched_val").value.toLowerCase())))
    }
    if (!localStorage.getItem("User")) {
        return (
            <Navigate to="/" replace={true} state={{ from: "/profile" }} />
        )
    }
    else {
        const bannedString = (a) => {
            let str = ""
            for (let i = 0; i < a.length - 1; i++) {
                str += a[i] + ","
            }
            str += a[a.length - 1]
            return str
        }
        props.changeState(0);
        return (
            <div className="container" id="subs" style={{marginLeft:"250px"}}>
                <h1>Subgreddits page</h1><br /><br />
                {!search_flag ? (<button type="button" className="btn btn-dark" onClick={SearchEnable}>Search</button>) : null}
                {search_flag ? (<>
                    <div style={{ display: 'flex', width: '70%', margin: "auto", marginBottom: "20px" }}>
                        <div className="input-group md-form form-sm form-1 pl-0">
                            <div className="input-group-prepend">
                                <span className="input-group-text purple lighten-3 " id="basic-text1"><FcSearch /></span>
                            </div>
                            <input id="searched_val" className="form-control my-0 py-1" type="text" placeholder="Search" aria-label="Search" value={searched} onChange={HandleChange} />
                        </div>
                        <div className="dropdown" style={{ marginLeft: "20px", marginRight: "20px" }}>
                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Sort By
                            </button>
                            <ul className="dropdown-menu">
                                <li><button className="dropdown-item" onClick={HandleName}>Name(Ascending)</button></li>
                                <li><button className="dropdown-item" onClick={HandleFollow}>Followers</button></li>
                                <li><button className="dropdown-item" onClick={HandleDate}>Creation Date</button></li>
                            </ul>
                        </div>
                        <div>
                            <input className="form-label my-0 py-1" type="text" placeholder='Enter tags' id="tagsInp" />
                        </div>
                        <button type="button" className="btn btn-secondary" style={{ marginLeft: "5px" }} onClick={HandleTagSearch}>Search</button>
                        <button type="button" className="btn btn-secondary" style={{ marginLeft: "5px" }} onClick={SearchEnable}>Back</button>
                    </div>
                    <div className='d-flex flex-column justify-content-center' style={{ width: '70%', margin: "auto", marginBottom: "20px" }}>
                        {subs.map((element) => {
                            return <div className='col-md-4' style={{ margin: "0px" }}><SearchItem name={element.name} /></div>
                        })}
                    </div>

                </>) : (
                    <div >
                        <h3 style={{ margin: "20px" }}>Joined Subgreddits</h3>
                        <div className="accordion" style={{ marginLeft: "25%" }}>
                            {
                                done ? (window.dupsubs.filter(dupsub => {
                                    if (dupsub.followers.includes(id.id)) {
                                        return true
                                    }
                                    else return false
                                }).map((element) => {
                                    return <div className='col-md-4' style={{ margin: "0px" }}><Subjoinitem name={element.name} 
                                    desc={element.description} followers={element.followers.length} posts={element.posts.length} 
                                    banned={bannedString(element.bannedWords)} flag={1} id={id} moderator={element.moderator}/></div>
                                })) : null
                            }
                        </div>
                        <h3 style={{ margin: "20px" }}>Other Subgreddits</h3>
                        <div className="accordion" style={{ marginLeft: "25%" }}>
                            {
                                done ? (window.dupsubs.filter(dupsub => {
                                    if (!dupsub.followers.includes(id.id)) {
                                        return true
                                    }
                                    else return false
                                }).map((element) => {
                                    return <div className='col-md-4' style={{ margin: "0px" }}><Subjoinitem name={element.name} desc={element.description} followers={element.followers.length} posts={element.posts.length} banned={bannedString(element.bannedWords)} flag={0}/></div>
                                })) : null
                            }
                        </div>
                    </div>
                )
                }

            </div >
        )
    }
}

