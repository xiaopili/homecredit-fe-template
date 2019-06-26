import {
	OPENID, BASEINFO
} from '@Stores/actions';
let stateDefault = {
	openId: 100935,
	baseInfo: '默认baseInfo'
}
const userInfo = (state = stateDefault, action) => {
	switch (action.type) {
	/*
	*  添加新的事项
	*  并进行本地化存储
	*  使用ES6展开运算符链接新事项和旧事项
	*  JSON.stringify进行对象深拷贝
	*/
	case OPENID:
		state = {
			...state, ...{
				[OPENID]: action.id
			}
		}
		return state;
	case BASEINFO:
		state = {
			...state, ...{
				[BASEINFO]: action.baseInfo
			}
		}
		return state;
	default:
		return state;
	}
}
export default userInfo;
