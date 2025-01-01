'use client';
import React from 'react'
import ReactPlayer from 'react-player/lazy'


const VideoPlayer = ({ url = 'https://www.youtube.com/watch?v=LXb3EKWsInQ', width, height }) => {
    return (
        <ReactPlayer url={url} width='80vw'
            height='80vh' />
    )
}

export default VideoPlayer