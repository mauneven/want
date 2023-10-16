import { environments } from "../environments/dev-environments";

export const endpoints = {
    login: `${environments.BASE_URL_API}/login`,
    register: `${environments.BASE_URL_API}/register`,
    user: `${environments.BASE_URL_API}/user`,
    posts: `${environments.BASE_URL_API}/posts`,
}

export default endpoints;