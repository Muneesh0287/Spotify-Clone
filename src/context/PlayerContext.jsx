import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props)=>{
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const [track , setTrack] = useState(songsData[0]);
    const[playStatus, setPlayStatus]= useState(false)
    const[time, setTime]= useState({
        currentTime:{
            sec:0,
            minute:0
        },
        totalTime:{
            sec:0,
            minute:0
        }
    })
   

    const play=()=>{
        audioRef.current.play();
        setPlayStatus(true)
    }
    const pause=()=>{
        audioRef.current.pause();
        setPlayStatus(false)
    }

    const playWithId = async(id)=>{
        await setTrack(songsData[id]);
        await audioRef.current.play();
        setPlayStatus(true)
    }

    const previous =async()=>{
        if (track.id>0) {
            await setTrack(songsData[track.id-1]);
            await audioRef.current.play();
            setPlayStatus(true);
        }
    }

    const next =async()=>{
        if (track.id< songsData.length-1) {
            await setTrack(songsData[track.id+1]);
            await audioRef.current.play();
            setPlayStatus(true);
        }
    }

    

    const seekSong = async (e) => { 
        const seekBgWidth = seekBg.current.offsetWidth;
        const clickOffsetX = e.nativeEvent.offsetX;
        const newTime = (clickOffsetX / seekBgWidth) * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
    };


      useEffect(() => {
        const updateTime = () => {
            if (audioRef.current) {
                const currentTime = audioRef.current.currentTime;
                const duration = audioRef.current.duration;
                
                const currentMinute = Math.floor(currentTime / 60);
                const currentSec = Math.floor(currentTime % 60);
                
                const totalMinute = Math.floor(duration / 60);
                const totalSec = Math.floor(duration % 60);
                
                setTime({
                    currentTime: {
                        minute: currentMinute,
                        sec: currentSec
                    },
                    totalTime: {
                        minute: totalMinute,
                        sec: totalSec
                    }
                });

                if (seekBar.current) {
                    seekBar.current.style.width = (currentTime / duration * 100) + "%";
                }
            }
        };

        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', updateTime);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', updateTime);
            }
        };
    }, [audioRef]);

    const contextvalue ={
        audioRef,
        seekBar,
        seekBg,
        track,setTrack,
        playStatus,setPlayStatus,
        time,setTime,
        play,pause,
        playWithId,
        previous,next,
        seekSong,


    }
    return (
        <PlayerContext.Provider value={contextvalue} >
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider;