import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react'
import Navbar from './components/Navbar';
import Login from './components/Login.js';
import Profile from './components/Profile';
import Followers from './components/Followers';
import Following from './components/Following';
import Edit from './components/Edit';
import Home from './components/Home';
import Mysub from './components/Mysub';
import Sub from './components/Sub';
import SubPage from './components/SubPage.js';
import SavedPage from './components/SavedPage';
import MysubUsers from './components/MysubUsers';
import MysubJoin from './components/MysubJoin';
import MysubReport from './components/MysubReport';
import MysubStat from './components/MysubStat';
import Chat from './components/Chat';
function App() {
  const [flag_l, setFlag] = useState(0);
  const [changeNav, setNav] = useState(0)
  const [id, setid] = useState()
  const [editState,setEdit] =useState("")
  return (
    <>
      <Router>
        <Navbar setFlag={setFlag} changeNav={changeNav} id={id} />
        <Routes>
          <Route exact path="/" element={<Login changeState={setNav} flag_l={flag_l} setFlag={setFlag} />} />
          <Route exact path="/profile" element={<Profile changeState={setNav} />} />
          <Route exact path="/profile/followers" element={<Followers changeState={setNav} />} />
          <Route exact path="/profile/following" element={<Following changeState={setNav} />} />
          <Route exact path="/profile/edit" element={<Edit changeState={setNav} editState={editState} setEdit={setEdit} />} />
          <Route exact path="/home" element={<Home changeState={setNav} />} />
          <Route exact path="/mysub" element={<Mysub changeState={setNav} setid={setid} />} />
          <Route exact path="/sub" element={<Sub changeState={setNav} />} />
          <Route exact path="/savedposts" element={<SavedPage changeState={setNav} />} />
          <Route path="/sub/:id" element={<SubPage changeState={setNav} />} />
          <Route path="/mysub/:id" element={<MysubUsers changeState={setNav} />} />
          <Route path="/mysub/:id/join" element={<MysubJoin changeState={setNav} />} />
          <Route path="/mysub/:id/reports" element={<MysubReport changeState={setNav} />} />
          <Route path="/mysub/:id/stats" element={<MysubStat changeState={setNav} />} />
          <Route path="/chats" element={<Chat changeState={setNav} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
