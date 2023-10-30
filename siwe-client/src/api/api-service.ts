import { api } from 'boot/axios';
import { showErrorMessage } from 'src/api/notify-service';
import { Axios, AxiosResponse } from 'axios';
import { setInitialLogged, setLoggedOut } from 'src/api/session-service';

const apiReqAuthorized = async (req: (axios: Axios) => Promise<any>): Promise<any> => {
    try {
        const res = await apiReq(req);
        setInitialLogged();
        return res;
    } catch (err: any) {
        if (err.response?.status === 401) {
            setLoggedOut();
        } else {
            setInitialLogged();
        }
        throw err;
    }
}

const apiReq = async (call: (axios: Axios) => Promise<any>): Promise<any> => {
    try {
        return await call(api);
    } catch (err: any) {
        if (!err.response || err.response.status === 500) {
            showErrorMessage('Something went wrong. Please try again later.');
        }
        throw err;
    }
}

export const post = async <T>(url: string, body?: any): Promise<T> =>
    await apiReq(async (axios) => await axios.post(url, body));

export const postAuthorized = async (url: string, body?: any) =>
    await apiReqAuthorized(async (axios) => await axios.post(url, body));

export const get = async <T>(url: string): Promise<T> => {
    return await apiReq(await getCall(url));
};

export const getAuthorized = async <T>(url: string): Promise<T> =>
    await apiReqAuthorized(await getCall(url));

const getCall = async (url: string) => {
    return async (axios: Axios): Promise<any> => {
        const res: AxiosResponse = await axios.get(url);
        if (res.status === 200) {
            return res.data;
        }
    };
}

export const putAuthorized = async <T>(url: string, body: any): Promise<T> =>
    await apiReqAuthorized(async (axios) => await axios.put(url, body));
