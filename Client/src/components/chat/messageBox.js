// Basic import.
import React, { useState } from "react";

// Component import.
import Message from "./message";

function MessageBox () {
    const[chat, setChat] = useState('')

    return (
        <div className="h-full w-full">
            {chat.map(message =>(
                <div className="flex flex-col overflow-y-auto">
                    <Message key={message.MessageID}
                            message={message}/>
                </div>
            ))}
        </div>
    )
}

export default MessageBox