import extractModels from './extract-models';

// eslint-disable-next-line @typescript-eslint/ban-types
function functionToExpressionString (foo: Function): string {
  const body = foo.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1];
  return `(function () { ${body} })()`;
}

function onPanelShown (window) {
  if (!window.EMBER_MODELS_GRAPH) {
    window.EMBER_MODELS_GRAPH = new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
      chrome.devtools.inspectedWindow.eval(functionToExpressionString(extractModels), (result, exceptionInfo) => {
        if (exceptionInfo) {
          reject(exceptionInfo);
        } else {
          resolve(result);
        }
      });
    });
  }
}

// eslint-disable-next-line no-undef
chrome.devtools.panels.create(
  'Ember Models Graph',
  null,
  'ext/panel.html',
  (extensionPanel) => {
    extensionPanel.onShown.addListener(onPanelShown);
  }
);