(function () {
  const { buildGraph, makeTree, buildHierarchyGraph } = window.EMBER_MODELS_DIAGRAM_EXTENSION.BUILD_GRAPH;

  function renderGraph (container, models, options) {
    const { nodes, edges } = buildGraph(models, {
      showRelationshipsQuantity: options.showRelationshipsQuantity,
      filter: options.filter
    });

    return cytoscape({
      container,
      elements: [
        ...nodes,
        ...edges
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
        name: options.displayType,
        roots: [options.rootModel],
        directed: true
      }
    });
  }

  function renderHierarchyTree (container, models, options) {
    const tree = makeTree(models);
    const { nodes, edges, roomModelName:graphRootModelName } =
      buildHierarchyGraph(options.rootModel, tree[options.rootModel]);

    return cytoscape({
      container,
      elements: [
        // { // node a
        //   data: { id: 'a' }
        // },
        // { // edge ab
        //   data: { id: 'ab', source: 'a', target:     'b' }
        // }
        ...nodes,
        ...edges
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
        name: options.displayType,
        roots: [graphRootModelName],
        spacingFactor: 2
        // directed: true
      }
    });
  }

  function render (_, __, options) {
    if (options.graphType === 'hierarchy') {
      renderHierarchyTree(...arguments);
    } else {
      renderGraph(...arguments);
    }
  }

  window.EMBER_MODELS_DIAGRAM_EXTENSION.renderGraph = render;
})();
