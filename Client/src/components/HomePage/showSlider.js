// Basic import.
import React from 'react'

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faShuffle, faForwardStep, faBackwardStep, faRepeat } from '@fortawesome/free-solid-svg-icons'

// Import photos.
import AlbumCover from "../../Photos/Eminem_album_cover.jpg"

// Import custom style for the bar handle.
import '../../styles/showHandle.css'

function ShowSlider () {
    const sliderStyle = {
      background: `linear-gradient(to right, #9818d6 ${64}%, #393e46 ${64}%)`,
      appearance: 'none',
      width: '100%',
      height: '6px',
      borderRadius: '9999px',
    }
  
    return (
        <div className="flex flex-col w-full ml-3.5">
            <div className="flex flex-row w-full gap-5">
                <img src={AlbumCover} className='w-20 select-none'/>
                <div className='flex flex-row ml-3.5 mt-16 gap-3'>
                    <FontAwesomeIcon className='text-white select-none' icon={faShuffle} />
                    <FontAwesomeIcon className='text-white select-none' icon={faBackwardStep} />
                    <div className='relative'>
                        <div className='absolute bg-purple-400 w-7 h-7 rounded-full p-2 flex justify-center items-center' style={{top: '-6px'}}>    
                            <FontAwesomeIcon className='text-white select-none' icon={faPause} />
                        </div>
                    </div>
                    <div className='ml-4'> </div> {/* / Make space between two icons. */}
                    <FontAwesomeIcon className='text-white select-none' icon={faForwardStep} />
                    <FontAwesomeIcon className='text-white select-none' icon={faRepeat} />
                </div>
            </div>
            <div className="w-full mt-4 pr-4">
                <input
                type="range"
                min="0"
                max="100"
                step="0.01"
                value={64}
                style={sliderStyle}
                className='show-slider-thumb'
                />
            </div>
        </div>
    )
}

export default ShowSlider
