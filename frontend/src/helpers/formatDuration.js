function formatDuration(duration){
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60)
    const secondes = duration % 60;

    const pad = (num) => String(num).padStart(2,"0")

    if(hours > 0){
        return `${hours}:${pad(minutes)}:${pad(secondes)}`
    }else{
        return `${minutes}:${pad(secondes)}`
    }
}

export default formatDuration