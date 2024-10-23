// Basic import.
import React from 'react';

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons' 

function Message (props) {
    // Get the message date and hour.
    const formatDate = (date) => {
        const now = new Date();
        const messageDate = new Date(date);
    
        // Extract hours and minutes
        const hours = messageDate.getHours().toString().padStart(2, '0');
        const minutes = messageDate.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
    
        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.floor((now - messageDate) / oneDay);
    
        if (diffDays === 0) {
            return time;  // Same day, show only hh:mm
        } else if (diffDays === 1) {
            return `Yesterday ${time}`;
        } else {
            return `${messageDate.getDate()}/${messageDate.getMonth() + 1}/${messageDate.getFullYear()} ${time}`;
        }
    };    

    return(
        <div className="text-white p-4" >
        <div className={`flex items-start gap-4 ${ props.username === props.message.sentFrom ? 'justify-end' : ''}`}>
            {props.image ?
                    props.username !== props.message.sentFrom &&
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={props.image} alt="Chat Avatar" className="w-full h-full object-cover" />
                    </div>
                    :
                    props.username !== props.message.sentFrom &&
                    <div className="bg-gradient-to-r from-purple-200 to-blue-200 flex justify-center items-center border-2 border-black-500 rounded-full h-10 w-10 ml-5">
                        <FontAwesomeIcon icon={faUser} className="text-lg text-white" />
                    </div>
            }
            <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                    <span className="font-medium"> {props.message.sentFrom} </span>
                    <time className="text-xs text-gray-200"> 
                        {formatDate(props.message.sentDate)}
                    </time>
                </div>
                <div className={`font-medium rounded-lg p-2 ${props.username === props.message.sentFrom ? 'bg-purple-300 mr-8' : 'bg-purple-200'}`}>
                    {props.message.message}
                </div>
            </div>
        </div>
    </div>

    )
}

export default Message