import {useContext} from "react";
import AuthContext from "../../contexts/AuthContext";


const UserProfilePage = () => {
    const { userInfo } = useContext(AuthContext);

    return (
        <div>
            <h2>User Profile Page</h2>
            <p>Username: {userInfo?.username}</p>
            <p>Email: {userInfo?.email}</p>
            <p>Is Admin: {userInfo?.is_admin === 1 ? 'Yes' : 'No'}</p>
        </div>
    );
};

export default UserProfilePage;
