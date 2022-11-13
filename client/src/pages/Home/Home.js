import './Home.css';
import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
function Home() {
  const [listOfUsers, setListOfUsers] = useState([]);
  let history = useNavigate();
  useEffect(() => {
    axios.get("http://localhost:5000/").then((response)=> {
      setListOfUsers(response.data)
    })
  }, [])
  return (
   <div className='users'>  
    {listOfUsers.map((value, key) =>{
      return (<div className='user' onClick={()=> {
        history(`/user/${value.user_id}`)
      }}> <h1>{value.email}</h1> </div>)
    })}
    </div>
  )
}

export default Home