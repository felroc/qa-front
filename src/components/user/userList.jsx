//import { getSuggestedQuery } from "@testing-library/react";
import { useState, useEffect } from "react";

const UserList = () =>{
    const [users, setUsers] = useState([]);

    const getUsers = async () =>{
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
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
                <div key={user.id}>
                    <h2>{user.name}</h2>
                    <span>{user.email}</span>
                </div>
            ))}
        </div>
    )
    
}

export default UserList