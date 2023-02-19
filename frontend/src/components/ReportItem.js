import React,{useState} from 'react'

export default function ReportItem(props) {
    const [cancel,setCancel] =useState(0)
    const [time,setTime] =useState(3)
    const IgnoreReport = async (a) => {
        let data = {
            report: a.report_id
        }
        const response = await fetch("http://localhost:3001/ignorereport", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.status == 200) {
            window.alert("Response saved")
            window.location.reload(false)
        }
    }
    const DeleteReport = async (a) => {
        let data = {
            report: a
        }
        const response = await fetch("http://localhost:3001/deletereport", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.status == 200) {
            window.alert("Post Deleted")
            window.location.reload(false)
        }
    }
    const sendReport=async(a)=>{
        let data = {
            report: a
        }
        const response = await fetch("http://localhost:3001/blockreport", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.status == 200) {
            window.alert("Post Blocked")
            window.location.reload(false)
        }
    }
    const BlockReport = async (a) => {
        setCancel(1)
        setTime(3)
        localStorage.setItem("time",2)
        window.timerID= setInterval(()=>{
            setTime(localStorage.getItem("time"))
            localStorage.setItem("time",localStorage.getItem("time")-1)
            console.log(localStorage.getItem("time"))
            if(localStorage.getItem("time")<0){
                setCancel(0);
                sendReport(a)
                clearInterval(window.timerID)
            }
        },1000)
        return
    }
    
    const CancelReport = () => {
        setCancel(0);
        clearInterval(window.timerID)
    }
    return (
        <div>
            <div>
                <div className="card" style={{ "width": "30%", marginLeft: "35%", backgroundColor: "lightgreen", marginBottom: "20px" }}>
                    <div className="card-body">
                        <h5 className="card-title" style={{ backgroundColor: "white", padding: "10px" }}>Posted By:{props.element.user}&nbsp;&nbsp;Reported By:{props.element.by}</h5>
                    </div>
                    <div className="card-body" style={{ backgroundColor: "white", padding: "10px", marginLeft: "20px", marginRight: "120px", marginBottom: "10px" }}>
                        <h6>Post :{props.element.content}</h6>
                    </div>
                    <div className="card-body" style={{ backgroundColor: "white", padding: "10px", marginLeft: "20px", marginRight: "120px", marginBottom: "10px" }}>
                        <h6>Reason :{props.element.reason}</h6>
                    </div>
                    <button disabled={props.element.action === 1} className="btn btn-dark" style={{ marginRight: "230px", marginLeft: "230px", marginBottom: "20px" }} onClick={() => { IgnoreReport(props.element) }}>Ignore</button>
                    {!cancel ? <button disabled={props.element.action === 1} className="btn btn-dark" style={{ marginRight: "230px", marginLeft: "230px", marginBottom: "20px" }} onClick={() => { BlockReport(props.element) }}>Block</button> : null}
                    {cancel ? <button disabled={props.element.action === 1} className="btn btn-dark" style={{ marginRight: "230px", marginLeft: "230px", marginBottom: "20px" }} onClick={CancelReport}>Cancel {time}</button> : null}
                    <button disabled={props.element.action === 1} className="btn btn-dark" style={{ marginRight: "230px", marginLeft: "230px", marginBottom: "20px" }} onClick={() => { DeleteReport(props.element) }}>Delete</button>
                </div>
            </div>
        </div>
    )
}
