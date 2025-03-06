import axios from 'axios';

let axiosIns: any = axios.create({
    baseURL: ''
});

axiosIns.defaults.responseType = 'json';

axiosIns.defaults.validateStatus = (status: number) => {
    return true;
};
axiosIns.interceptors.request.use((config: any) => {
    config['timeout'] = 60 * 1000 * 10;
    // console.log('config::::', config);
    if (localStorage.getItem('token')) config['headers']['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    if (config.method === 'get') {
        config.url = config.url.indexOf('?') === -1 ? `${config.url}?_rnd=${Date.now()}` : `${config.url}&_rnd=${Date.now()}`;
    }

    return config;
});

axiosIns.interceptors.response.use((response: any) => {
    let data = response.data;
    let status = response.status;
    if ([200, 201].includes(status)) {
        if (data?.code === 401) {
            return Promise.reject(data);
        }
        return Promise.resolve(data);
    } else {
        return Promise.resolve(data);
    }
});

export default axiosIns;
