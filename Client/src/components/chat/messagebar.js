// Basic imports.
import React,{ useState, useContext } from 'react'

// Import context from musicHome to get variables.
import { RenderContext } from '../../Pages/musicHome';

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function MessageBar (props) {
    const { socket } = useContext(RenderContext)
    const [message,setMessage] = useState ("");

    // Handle a new message.
    const handleSendMesage = (e) => {
        e.preventDefault();

        console.log(props.conversationID, message)
        socket.emit('message', props.conversationID, message, props.username)

        setMessage("");
    }

    // Change message.
    const changeMessage = (event) => {
        setMessage(event.target.value)
    }

    return(   
        <div className="">
            <form onSubmit={handleSendMesage} className='containerWrap flex items-center justify-center flex-row gap-8'>
                <input value={message} onChange={changeMessage} className='input pl-4 w-4/6 text-black-500 focus:outline-none bg-gray-100 rounded-xl h-8' type="text" />
                <button>
                    <FontAwesomeIcon type ="submit" icon={faPaperPlane} className="text-2xl" />
                </button>
            </form>
        </div>            

    )
}
export default MessageBar