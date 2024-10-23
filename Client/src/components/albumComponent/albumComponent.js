// Basic import.
import React from 'react';


const Album = (props) => {
    return(
        <div className="p-5 rounded-xl text-center cursor-pointer hover:bg-purple-transparent h-auto" style={{width :"250px"}}>
            <img src={props.image} alt="Description" className="ml-auto mr-auto  rounded-xl w-44 h-44 object-cover" />
            <div className='flex flex-col'>
                <p className="card-title font-exo font-bold text-xl">{props.name}</p>
                <p className="card-title font-exo text-gray">{props.year}, {props.artist}</p>
                <p className="card-title font-exo text-gray">{props.genre}</p>
            </div>
            
        </div>
    )
}

export default Album