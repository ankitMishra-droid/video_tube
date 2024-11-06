const backendDomain = "http://localhost:7000"

const fetchApi = {
    signup: {
        url: `${backendDomain}/api/users/register`,
        method: "POST"
    },
    login: {
        url: `${backendDomain}/api/users/login`,
        method: "POST"
    }
}

export default fetchApi