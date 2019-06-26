import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducers';

let configureStore = (initialState) => {
	const store = createStore(reducer, initialState, compose(
		applyMiddleware(thunkMiddleware),
		typeof window.devToolsExtension === 'function' ? window.devToolsExtension() : f => f
	));
	return store;
}
let store = configureStore();

export default store;
