import ReactDOM from 'react-dom';
import { Route, IndexRoute, hashHistory, Router } from 'react-router';
import { Provider } from 'react-redux';

import store from '@Stores';

import App from './App';
import HelloHomecredit from '@Routes/HelloHomecredit';

ReactDOM.render(
	<Provider store={store}>
		<Router history={hashHistory}>
			<Route
				path="/"
				component={App}
			>
				<IndexRoute component={HelloHomecredit} />
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root'),
);
