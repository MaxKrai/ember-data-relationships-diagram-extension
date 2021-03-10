import extractModels from './extract-models';

function functionToExpressionString (foo: Function): string {
  const body = foo.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1];
  return `(function () { ${body} })()`;
}

function onPanelShown (window) {
	if (!window.EMBER_MODELS_GRAPH) {
		window.EMBER_MODELS_GRAPH = new Promise(function (resolve, reject) {
			chrome.devtools.inspectedWindow.eval(functionToExpressionString(extractModels), function (result, exceptionInfo) {
				resolve(result);
			});
		});
	}
}

chrome.devtools.panels.create(
	'Ember Models Graph',
	null,
	'ext/panel.html',
	function (extensionPanel) {
		extensionPanel.onShown.addListener(onPanelShown);
	}
);