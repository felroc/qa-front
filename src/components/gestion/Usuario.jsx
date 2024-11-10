
import { useState, useEffect } from "react";

const ComboBox = (selected, lista, handler)=>{

    return (
        <select name="user" value={selected} onChange={handler} onClick={handler} className="form-select" >
            {lista.map((item, index)=>(
                <option key={index} value={item.Fullname}>{item.Fullname}</option>
            ))}
        </select>
    )
}

export default ComboBox