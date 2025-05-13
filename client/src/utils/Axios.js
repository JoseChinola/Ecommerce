import axios from "axios";
import SummaryApi, { baseURL } from "../cammon/SummaryApi";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

//sending access token in the header
Axios.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accessToken')

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)


// refresh token 
Axios.interceptors.request.use(
    (res) => {
        return res
    },
    async (error) => {
        let originRequest = error.config

        if (error.res.status === 401 && !originRequest.retry) {
            originRequest.retry = true

            const refreshToken = localStorage.getItem("refreshToken")
            if (refreshToken) {
                const newAccessToken = await refreshAccessToken(refreshToken)

                if (newAccessToken) {
                    originRequest.headers.Authorization = `Bearer ${newAccessToken}`
                    return Axios(originRequest)
                }
            }
        }

        return Promise.reject(error)
    }
)


const refreshAccessToken = async (refreshToken) => {
    try {
        const res = await Axios({
            ...SummaryApi.refreshToken,
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        })
        const accessToken = res.data.data.accessToken
        localStorage.setItem('accessToken', accessToken)
        return accessToken
    } catch (error) {
        console.log(error)
    }
}

export default Axios