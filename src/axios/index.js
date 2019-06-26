let axios = window.axios;

import Qs from 'qs';

import { Toast } from 'antd-mobile';

import HomeCreditEnv from './env';

import isExclude from './exclude';


const CancelToken = axios.CancelToken;
let pending = [];

let removePending = (config) => {
	for(let p in pending){
		if(pending[p].u === config.url + '&' + config.method) {
			pending[p].f();
			pending.splice(p, 1);
		}
	}
}

axios.interceptors.request.use( config => {

	if (isExclude(config)) {
		return config;
	}
	removePending(config);
	config.cancelToken = new CancelToken((c)=>{
		pending.push({ u: config.url + '&' + config.method, f: c });
	});
	return config;
}, error => {
	return Promise.reject(error);
});

axios.interceptors.response.use( response => {
	return response;
}, function (error) {
	console.log('error', error);
	Toast.fail(response.data.msg || '请求错误', 1);

	return Promise.reject(error);
});

export const rpc = ({method, api, data = {}, params = {}}) => {
	return axios({
		method: method,
		url: HomeCreditEnv.getUrl(api),
		data: data,
		params: params,
		withCredentials: true,
		transformRequest: [function (data) {
			data = Qs.stringify(data);
			return data;
		}],
		headers:{'Content-Type':'application/x-www-form-urlencoded'}
	})
}


