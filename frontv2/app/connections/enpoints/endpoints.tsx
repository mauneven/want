import { environments } from "../environments/environments";

export const endpoints = {
    login: `${environments.BASE_URL_API}/login`,
    register: `${environments.BASE_URL_API}/register`,
    logout: `${environments.BASE_URL_API}/logout`,
    user: `${environments.BASE_URL_API}/user`,
    updateuser: `${environments.BASE_URL_API}/users/me`,
    posts: `${environments.BASE_URL_API}/posts`,
    myposts: `${environments.BASE_URL_API}/my-posts`,

}

export default endpoints;