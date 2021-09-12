import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import "./index.css";

const UserRow = (props) => {
  //   console.log(props);
  const { user } = props;
  const { name, id, email, role } = user;

  const deleteUserRow = () => {};

  const editUserRow = () => {};

  return (
    <tr>
      <td>
        <input type="checkbox" id={id} className="column-checkbox" />
      </td>
      <td>{name}</td>
      <td>{email}</td>
      <td>{role}</td>
      <td>
        <button
          type="button"
          onClick={editUserRow}
          className="admin-tools-button"
        >
          <FaRegEdit className="admin-tools edit" />
        </button>
        <button
          type="button"
          onClick={deleteUserRow}
          className="admin-tools-button"
        >
          <AiOutlineDelete className="admin-tools delete" />
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
