import axios from "axios";
import * as Urls from "../servers-urls";


const API_URL = Urls.WEBSERVICE_URL + "/auth/";


class AuthService
{
    login(email, password)
    {
        return axios.post(API_URL + "signin", {
            email,
            password
        })
        .then( response => {
            if( response.data.accessToken )
                localStorage.setItem("user", JSON.stringify(response.data));

            return response.data;
        });
    }

    logout()
    {
        return new Promise( resolve => {
            localStorage.removeItem("user");
            resolve();
        });
    }

    register(email, password)
    {
        return axios.post(API_URL + "signup", {
            email,
            password
        });
    }

    getCurrentUser()
    {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();