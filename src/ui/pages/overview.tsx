import { h, FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import Form from './overview/form';
import View from './overview/view';
import { GraphType, ModelDescriptor, ModelDescriptorMap, OverviewForm } from '../../interfaces';
import { GraphData, makeTree, buildHierarchyGraph, buildGraph } from '../utils/build-graph';

import './overview.scss';

declare const EMBER_MODELS_GRAPH:any;

interface OverviewPageState {
	overviewForm: OverviewForm,
	graphData: GraphData
}

function getGraphData (models: ModelDescriptorMap, form: OverviewForm): GraphData {
	return buildGraph(models, {
		showRelationshipsQuantity: form.showConnectionsCount,
		filter: function (modelName: string, modelEntity: ModelDescriptor, index: number) {
			if (!form.filter) {
				return true;
			}
			return modelName.includes(form.filter);
		}
	});
}

function getHierarchyData (models: ModelDescriptorMap, form: OverviewForm): GraphData {
	const tree = makeTree(models);
	return buildHierarchyGraph(form.rootModel, tree[form.rootModel]);
}

const OverviewPage: FunctionComponent = function () {
	const [ state, setState ] = useState<OverviewPageState>({
		overviewForm: null,
		graphData: null
	});

	const onSubmit = (state: OverviewForm) => {
		EMBER_MODELS_GRAPH.then(res => {
			if (!res.error) {
				setState({
					overviewForm: state,
					graphData: state.type === GraphType.graph ?
						getGraphData(res.data, state) :
						getHierarchyData(res.data, state)
				});
			}
		});
	};

	return (<div class="overview-page">
		<div class="panel">
			<Form onSubmit={onSubmit} />
		</div>
		<div class="view">
			<View data={state.graphData} overviewForm={state.overviewForm} />
		</div>
	</div>);
}

export default OverviewPage;
