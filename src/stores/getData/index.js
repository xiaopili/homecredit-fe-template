import { rpc } from '@Axios';
import dispatch from '@Stores/dispatch';

import {
	BASEINFO
} from '@Stores/actions';


export const getBaseInfo = () => {
	let config = {
		method: 'get',
		api: 'getBaseInfo'
	}
	rpc(config)
		.then((res)=>{
			dispatch({
				type: BASEINFO,
				[BASEINFO]: res.data.info || '返回错误'
			})
		})
}
