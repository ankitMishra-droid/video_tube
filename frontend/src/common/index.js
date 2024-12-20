const backendDomain =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;

const fetchApi = {
    siteCheck: {
        url: `${backendDomain}/healthCheck`,
        method: "GET"
    },
    signup: {
        url: `${backendDomain}/api/users/register`,
        method: "POST"
    },
    login: {
        url: `${backendDomain}/api/users/login`,
        method: "POST"
    },
    cuurentUser: {
        url: `${backendDomain}/api/users/get-current-user`,
        method: "GET"
    },
    userProfile: {
        url: `${backendDomain}/api/users/channel-name`,
        method: "GET"
    },
    logoutUser: {
        url: `${backendDomain}/api/users/logout`,
        method: "GET"
    },
    userSubscribe: {
        url: `${backendDomain}/api/subscribe/c`,
        method: "POST"
    },
    getAboutChannel: {
        url: `${backendDomain}/api/dashboard`,
        method: "GET"
    },
    getUserVideo: {
        url: `${backendDomain}/api/video/c`,
        method: "GET"
    },
    getUserPlayList: {
        url: `${backendDomain}/api/playlist`,
        method: "GET"
    },
    getUserSubscriber: {
        url: `${backendDomain}/api/subscribe`,
        method: "GET"
    },
    getAllVideos: {
        url: `${backendDomain}/api/video`,
        method: "GET"
    },
    channelStats: {
        url: `${backendDomain}/api/dashboard`,
        method: "GET"
    },
    toggleLike: {
        url: `${backendDomain}/api/like`,
        method: "POST"
    },
    commentsOnVideo: {
        url: `${backendDomain}/api/comment`,
        method: "GET"
    },
    watchHistory: {
        url: `${backendDomain}/api/users/watch-history`,
        method: "GET"
    },
    getLikedVideos: {
        url: `${backendDomain}/api/like/videos`,
        method: "GET"
    }
}

export default fetchApi