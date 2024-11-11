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
        url: `${backendDomain}/api/users`,
        method: "GET"
    },
    logoutUser: {
        url: `${backendDomain}/api/users/logout`,
        method: "GET"
    }
}

export default fetchApi