import { h, FunctionComponent } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import cytoscape from 'cytoscape';
import { GraphData } from '../../utils/build-graph';
import { GraphType, OverviewForm } from '../../../interfaces';

import './view.scss';

interface ViewProps {
	data: GraphData,
	overviewForm: OverviewForm
}

function getGraphConfig (container: Element, data: GraphData, form: OverviewForm) {
	return {
		container,
		elements: [
			...data.nodes,
			...data.edges
		],
		style: [ // the stylesheet for the graph
			{
				selector: 'node',
				style: {
					'background-color': 'red',
					'label': 'data(id)'
				}
			},
			{
				selector: 'edge',
				style: {
					'width': 2,
					'line-color': function (ele) {
						return ele.data('async') ?
						'#FF0000' :
						'#0000FF'
					},
					'target-arrow-color': '#000',
					'target-arrow-shape': 'triangle',
					'curve-style': 'bezier'
				}
			}
		],
		layout: {
			name: form.displayType,
			roots: [form.rootModel],
			directed: true
		}
	};
}

function getHierarchyConfig (container: Element, data: GraphData, form: OverviewForm) {
	return {
		container,
		elements: [
			// { // node a
			//   data: { id: 'a' }
			// },
			// { // edge ab
			//   data: { id: 'ab', source: 'a', target:     'b' }
			// }
			...data.nodes,
			...data.edges
		],
		style: [
			{
				selector: 'node',
				style: {
					'background-color': 'red',
					'label': function (ele) {
						return ele.data('name')
					}
					// 'label': 'data(id)'
				}
			},
			{
				selector: 'edge',
				style: {
					'width': 2,
					'line-color': function (ele) {
						return ele.data('async') ?
						'#FF0000' :
						'#0000FF'
					},
					'target-arrow-color': '#000',
					'target-arrow-shape': 'triangle',
					'curve-style': 'bezier'
				},
				'label': 'data(id)'
			}
		],
		layout: {
			name: form.displayType,
			roots: [data.rootModelName],
			spacingFactor: 2
			// directed: true
		}
	};
}

function draw (container, data, overviewForm) {
	const config = overviewForm.type === GraphType.graph ?
				getGraphConfig(container.current, data, overviewForm) :
				getHierarchyConfig(container.current, data, overviewForm)
		cytoscape(config);
}

const View: FunctionComponent<ViewProps> = function ({ data, overviewForm }: ViewProps) {
	const container = useRef(null);
	useEffect(() => {
		if (data && overviewForm) {
			draw(container, data, overviewForm);
		}
	});

	return (<>
		<div class="overview-page-graph" ref={container}></div>
	</>);
}

export default View;
