let { Component } = React;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 0
		};
	}
	render() {
		return (
			<div>
				{/* layout */}
				{this.props.children}
				{/* layout */}
			</div>
		);
	}
}

export default App;
