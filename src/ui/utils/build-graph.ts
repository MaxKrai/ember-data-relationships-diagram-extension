import { ModelDescriptorMap, GraphNode, GraphEdge, ModelDescriptor } from '../../interfaces';

export interface GraphData {
  nodes: Array<GraphNode>,
  edges: Array<GraphEdge>,
  rootModelName?: string
}

interface ChildNodeInfo {
  hash: TreeMapNode,
  relFromParentToHash: {
    from: string,
    to: string,
    kind: 'hasMany' | 'belongsTo',
    key: string,
    inverse: boolean,
    async: boolean
  }
}

interface ParentNodeInfo {
  hash: TreeMapNode,
  key: string
}

interface TreeMapNode {
  children: Array<ChildNodeInfo>,
  data: ModelDescriptor,
  parent: Array<ParentNodeInfo>
}

export type TreeMap = { [key: string]: TreeMapNode }

const SEP = '#';

/**
 *
 * @param {Array} models 
 */
export function makeTree (models: ModelDescriptorMap): TreeMap {
  const hash = {};
  Object.keys(models).forEach(modelName => {
    const model = models[modelName];
    if (!hash[modelName]) {
      hash[modelName] = {
        data: model,
        parent: []
      };
    } else if (!hash[modelName].data) {
      hash[modelName].data = model;
    }
    hash[modelName].children = model.relationships.map(relationship => {
      if (!hash[relationship.linkTo]) {
        hash[relationship.linkTo] = { parent: [] };
      }

      hash[relationship.linkTo].parent.push({
        key: relationship.key,
        hash: model
      });

      return {
        relFromParentToHash: {
          from: modelName,
          to: relationship.linkTo,
          kind: relationship.kind,
          key: relationship.key,
          async: relationship.async,
          inverse: relationship.inverse
        },
        hash: hash[relationship.linkTo]
      };
    })
  });
  console.log(hash);
  return hash;
}

interface BuildGraphOptions {
  showRelationshipsQuantity?: boolean,
  filter(modelName: string, descriptor: ModelDescriptor, index: number): boolean
}

// 1 model type - 1 graph node
export function buildGraph (models: ModelDescriptorMap, options: BuildGraphOptions): GraphData {
  const edges = [];
  const nodes = [];

  Object.keys(models).forEach((modelName, index) => {
    if (!options.filter(modelName, models[modelName], index)) {
      return;
    }

    nodes.push({
      data: { id: modelName }
    });

    if (models[modelName].relationships.length > 0) {
      models[modelName].relationships.forEach((relationship, relIndex)   => {

        const id = options.showRelationshipsQuantity ? `${modelName}${relationship.linkTo}/${index}/${relIndex}` : `${modelName}${relationship.linkTo}`;
        edges.push({
          data: {
            id,
            source: modelName,
            target: relationship.linkTo,
            inverse: relationship.inverse,
            async: relationship.async
          }
        });
      })
    }
  });

  return { edges, nodes };
}

export function buildHierarchyGraph (rootModel: string, rootNode: TreeMapNode): GraphData {
  const nodes = [];
  const edges = [];

  const extractRelations = (type: string, node: TreeMapNode, key = '', prevNodeId = '', circularController = {}) => {
    const nodeId = `${prevNodeId}${SEP}${key}${SEP}${type}`;
    nodes.push({
      data: { id: nodeId, name: type }
    });

    circularController = {
      ...circularController,
      [type]: nodeId
    };

    node.children.forEach(extendedNode => {
      const { relFromParentToHash: rel, hash } = extendedNode;

      const targetNodeId = circularController[rel.to] ||
				`${nodeId}${SEP}${rel.key}${SEP}${rel.to}`;
      edges.push({
        data: {
          id: `rel: ${nodeId}${SEP}${rel.key}${SEP}${rel.to}`,
          source: nodeId,
          target: targetNodeId,

          kind: rel.kind,
          async: rel.async,
          inverse: rel.inverse
        }
      });

      if (!circularController[rel.to]) {
        extractRelations(rel.to, hash, rel.key, nodeId, circularController);
      }
    });
  };

  extractRelations(rootModel, rootNode);

  return {
    nodes,
    edges,
    rootModelName: `${SEP}${SEP}${rootModel}`
  };
}
