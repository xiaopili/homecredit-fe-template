
import apiConfig from './api';
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
let baseUrl = 'https://www.easy-mock.com/mock/5d09ce06fdc6514ee3176a42/fe-wechat-paring/'
export default {
	getUrl: (apiName) => {
		return `${baseUrl}${apiConfig[apiName]}`;
	}
}

