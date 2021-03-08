'use strict';

(function () {
	window.EMBER_MODELS_DIAGRAM_EXTENSION = {};

	const SEP = '#';

	/**
	 *
	 * @param {Array} models 
	 */
	function makeTree (models) {
  	const hash = {};
  	Object.keys(models).forEach(function (modelName) {
    	const model = models[modelName];
    	if (!hash[modelName]) {
      	hash[modelName] = {
        	data: model,
        	parent: []
      	};
    	} else if (!hash[modelName].data) {
      	hash[modelName].data = model;
    	}
    	hash[modelName].children = model.relationships.map(function (relationship) {
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
  	return hash;
	}

	// 1 model type - 1 graph node
	function buildGraph (models, options) {
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

	function buildHierarchyGraph (rootModel, rootNode) {
  	const nodes = [];
  	const edges = [];

  	const extractRelations = (type, node, key = '', prevNodeId = '', circularController = {}) => {
    	const nodeId = `${prevNodeId}${SEP}${key}${SEP}${type}`;
    	nodes.push({
      	data: { id: nodeId, name: type }
    	});

    	circularController = {
      	...circularController,
      	[type]: nodeId
    	};

    	node.children.forEach(function (extendedNode, index) {
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
			roomModelName: `${SEP}${SEP}${rootModel}`
		};
	}

	window.EMBER_MODELS_DIAGRAM_EXTENSION.BUILD_GRAPH = {
		buildGraph,
		buildHierarchyGraph,
		makeTree
	};
})();
