//import { getSuggestedQuery } from "@testing-library/react";
import { useState, useEffect } from "react";

const UserList = ({frontend,backend}) =>{
    const [users, setUsers] = useState([]);

    const getUsers = async () =>{
        console.log(backend);
        const response = await fetch(backend+"/api/qa/users");
        //console.log(response);
        const data = await response.json();
        //console.log(data);
        setUsers(data);
    }

    useEffect(()=>{
        getUsers();
    },[])

    return (
        <div>
            {users.map((user)=>(
                <div key={user.Username}>
                    <h2>{user.Fullname}</h2>
                    <span>{user.Username}</span>
                    <span>{user.Email}</span>
                </div>
            ))}
        </div>
    )
    
}

export default UserList