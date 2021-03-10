interface Attribute {
  key: string,
  type: string
}

interface Relationship {
	key: string,
	kind: 'hasMany' | 'belongsTo',
	linkTo: string,
	async: boolean,
	inverse: boolean
}

export interface ModelDescriptor {
	attributes: Array<Attribute>,
	relationships: Array<Relationship>
}

export type ModelDescriptorMap = { [key: string]: ModelDescriptor }

export enum GraphType {
	graph = 'graph',
	hierarchy = 'hierarchy'
}

export enum DisplayType {
	circle = 'circle',
	concentric = 'concentric',
	breadthfirst = 'breadthfirst'
}

export interface OverviewForm {
	type: GraphType,
	displayType: DisplayType,
	rootModel: string,
	filter: string,
	showConnectionsCount: boolean
}

export interface GraphNode {
	data: { id: string }
}

export interface GraphEdge {
	data: { id: string, source: string, target: string }
}

export type GraphData = Array<GraphNode|GraphType>;
