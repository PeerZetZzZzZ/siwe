import { api } from 'boot/axios';
import { showErrorMessage } from 'src/api/notify-service';
import { AxiosResponse } from 'axios';
import { setInitialLogged, setLoggedOut } from 'src/api/session-service';

const apiCallAuthorized = async (action: () => any) => {
    try {
        const res = await action();
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

const action = async (apiCall: () => any) => {
    try {
        return await apiCall();
    } catch (err: any) {
        if (!err.response || err.response.status === 500) {
            showErrorMessage('Something went wrong. Please try again later.');
        } else {
            throw err;
        }
    }
}

export const post = async <T>(url: string, body?: any): Promise<T> => {
    return action(() => api.post(url, body));
}

export const postAuthorized = async <T>(url: string, body?: any): Promise<T> => {
    return apiCallAuthorized(async () => {
        return post(url, body);
    });
}

export const getAuthorized = async <T>(url: string): Promise<T> => {
    return apiCallAuthorized(async () => {
        return await get(url);
    });
}

export const get = async <T>(url: string): Promise<T> => {
    return await action(async () => {
        const res: AxiosResponse = await api.get(url);
        if (res.status === 200) {
            return res.data;
        }
    });
}


export const putAuthorized = async <T>(url: string, body: any): Promise<T> => {
    return apiCallAuthorized(async () => {
        return await action(async () => {
            await api.put(url, body);
        });
    });
}
