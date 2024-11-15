function getTimeDistance(date){
    const now = new Date();
    const old = new Date(date);
    const difference = now.getTime() - old.getTime()

    const secondes = Math.floor(difference / 1000);
    const minutes = Math.floor(secondes / 60);
    const hours = Math.floor(minutes / 24);
    const day = Math.floor(hours / 24);
    const weeks = Math.floor(day / 7)
    const month = Math.floor(day / 30);
    const year = Math.floor(month / 12);

    if(year > 0){
        if(year === 1){
            return `${year} year ago`;
        }
        return `${year} years ago`
    }else if(month > 0){
        if(month === 1){
            return `${month} month ago`
        }
        return `${month} months ago`
    }else if(weeks > 0){
        if(weeks === 1){
            return `${weeks} week ago`
        }
        return `${weeks} weeks ago`
    }else if(day > 0){
        if(day === 1){
            return `${day} day ago`
        }
        return `${day} days ago`
    }else if(hours > 0){
        if(hours === 1){
            return `${hours} hour ago`
        }
        return `${hours} hours ago`
    }else if(minutes > 0){
        if(minutes === 1){
            return `${minutes} minute ago`
        }
        return `${minutes} minutes ago`
    }else{
        return "Just now"
    }
}

export default getTimeDistance