// Basic imports.
import React, { useState } from 'react';

function SearchRecent(props) {
    const [isHovered, setIsHovered] = useState (false);

    return (
        <div className="flex flex-row  rounded-xl  cursor-pointer hover:bg-purple-transparent h-auto relative ml-8 mt-2" style={{ width: "300px"}}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <img src={props.image} alt="Description" className="ml-2 rounded-xl w-20 h-20 object-cover" />
            {isHovered && (
                <div className="absolute inset-0 flex justify-center place-self-middle mr-52 ml-2 bg-black bg-transparent rounded-xl">
                    <button className="text-white text-3xl">
                        <i className="fas fa-play"></i>
                    </button>
                </div>
            )}
            <div className='flex flex-col ml-8 mt-4'>
                <p className="card-title font-exo line-clamp-1">{props.title}</p>
                <p className="card-title font-exo text-gray line-clamp-1">{props.artist}</p>
            </div>
        </div>
    )
}

export default SearchRecent;