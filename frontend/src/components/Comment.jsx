import fetchApi from '@/common'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const Comment = ({video}) => {
    const [comments, setComments] = useState([]);
    const { videoId } = useParams();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true)


    const videoComments = async() => {
        const response = await fetch(`${fetchApi.commentsOnVideo.url}/getcomments/${videoId}`, {
            method: fetchApi.commentsOnVideo.method,
            credentials: "include"
        });

        const resData = await response.json();
        if(resData?.data.length === 10){
            setComments((prev) => [...prev, ...resData?.data])
        }else{
            setComments((prev) => [...prev, ...resData?.data])
            setHasMore(false)
        }
    }

    useEffect(() => {
        if(page === 1){
            setComments([]);
        }

        videoComments()
    },[videoId, page])

  return (
    <div>
      <div className="mt-4">
            <h1 className="font-bold text-2xl">Comments ({comments.length})</h1>
        </div>
    </div>
  )
}

export default Comment
