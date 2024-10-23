// Basic imports.
import React ,{useState} from "react";

// Component imports.
import FriendsBasic from "../friends/friendsBasic";
import FriendsAdd from "../friends/friendsAdd";

// For toast.
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Friends (props) {
    const [friendsPage,setFriendsPage] = useState("friendsBasic")
    
    const renderComponent = () => {
        switch (friendsPage) {
            case 'friendsBasic':
                return <FriendsBasic requests={props.requests} setFriendsPage={setFriendsPage} setRender={props.setChoice} setFriend={props.setFriend} />;
            case 'friendsAdd':
                return <FriendsAdd setFriendsPage={setFriendsPage} requests={props.requests} setRequestNotification={props.setRequestNotification} />;
            default:
                return null;
        }
    }

    return(
        <div className="flex flex-col text-white h-full w-full">
            {renderComponent()}
            <ToastContainer />
        </div>
    )
}

export default Friends