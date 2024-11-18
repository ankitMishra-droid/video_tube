const backendDomain = "http://localhost:7000"

const fetchApi = {
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
}

export default fetchApi