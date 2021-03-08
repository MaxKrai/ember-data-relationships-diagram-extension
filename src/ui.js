"use strict";

(function () {
	const MODULE = window.EMBER_MODELS_DIAGRAM_EXTENSION;

	const DOM = {
		container: document.getElementById('graph'),
		graphTypeSelect: document.getElementById('graph-type-select'),
		displayTypeSelect: document.getElementById('display-type-select'),
		visualizeBtn: document.getElementById('visualize-btn'),
		rootModelInp: document.getElementById('root-model-inp'),
		modelFilterInp: document.getElementById('filter-model-inp'),
		showConnectionsCountInp: document.getElementById('show-connections-count')
	};

	DOM.visualizeBtn.addEventListener('click', function () {

		if (window.emberModelsConfig && window.emberModelsConfig.error) {
			return;
		}

		MODULE.renderGraph(DOM.container, window.emberModelsConfig.data, {
			graphType: DOM.graphTypeSelect.value,
			displayType: DOM.displayTypeSelect.value,
			rootModel: DOM.rootModelInp.value,
			filter: function (modelName, modelEntity, index) {
				if (!DOM.modelFilterInp.value) {
					return true;
				}
				return modelName.includes(DOM.modelFilterInp.value)
			},
			showRelationshipsQuantity: DOM.showConnectionsCountInp.checked
		});
	});
})();
