
const UserRow = ( {index, user, onView, onEdit, onDelete} ) => {

    return (
        <tr>
            <td>{index}</td>
            <td>{user.Username}</td>
            <td>{user.Fullname}</td> 
            <td>{user.Email}</td> 
            <td>{user.Created}</td>
            <td>
                <input type="button" onClick={onView} value={'Consultar'}></input>                
            </td>
            <td>
                <input type="button" onClick={onEdit} value={'Editar'}></input>                
            </td>
            <td>
                <input type="button" onClick={onDelete} value={'Eliminar'}></input>                
            </td>
        </tr>
    )
}

export default UserRow;