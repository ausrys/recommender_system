import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
function User() {
    let {id} = useParams();
    const [userObject, setUserobject] = useState({});
    useEffect(() => {
      axios.get(`http://localhost:5000/user/${id}`).then((response)=> {
        setUserobject(response.data);
      })
    }, [])
  return (
    <div>{userObject.email}</div>
  )
}

export default User