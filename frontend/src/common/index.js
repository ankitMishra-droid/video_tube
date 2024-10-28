const backendDomain = "http://localhost:7000"

const apiURL = {
    signup: {
        url: `${backendDomain}/api/users/register`,
        method: "POST"
    },
    login: {
        url: `${backendDomain}/api/users/login`,
        method: "POST"
    }
}