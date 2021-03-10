import { h, FunctionComponent } from 'preact';
import OverviewPage from './pages/overview';
import './app.scss';

const App: FunctionComponent = function () {
	return (<div class="app">
		<OverviewPage />
	</div>);
};

export default App;
