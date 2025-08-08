import { useEffect, useRef } from "react";

const View = ({videoId, userId, duration}) => {
    const videoRef = useRef(null)
    const hasViewd = useRef(false)

    useEffect(() => {
        const video = videoRef.current;
        let viewTimeout;

        if(video){
            video.addEventListener("play", () => {
                viewTimeout = setTimeout(() => {
                    
                })
            })
        }
    })
    return(
        <></>
    )
}

export default View;