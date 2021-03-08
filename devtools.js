const backgroundPageConnection = chrome.runtime.connect({
  name: 'devtools-page'
});

const onPanelShown = (window) => {
  chrome.devtools.inspectedWindow.eval(functionToExpressionString(extract), function (result, error) {
    window.emberModelsConfig = result;
  });
}

chrome.devtools.panels.create("Ember Models Diagram",
  null,
  "panel.html",
  function (extensionPanel) {
    extensionPanel.onShown.addListener(onPanelShown);
  }
);

function functionToExpressionString (foo) {
  const body = foo.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1];
  return `(function () { ${body} })()`;
}

function extract () {
  if (!Ember) {
    return {
      error: 'Ember application is not detected or it is powered by old version of Ember (< rc5)'
    }
  }

  const owner = Ember.Namespace["NAMESPACES"]
    .find(namespace => namespace instanceof Ember.Application)
    .__container__;
  const dataAdapter = owner.lookup('data-adapter:main');
  if (!dataAdapter) {
    return {
      error: 'Ember Data is not detected or old version of Ember (< rc7) is used or old version of Ember Data (< 0.14) is used.'
    };
  }

  /**
   * https://github.com/emberjs/data/issues/7112
   * https://github.com/cardstack/ember-data-fastboot/pull/21
   * https://github.com/cardstack/ember-data-fastboot/pull/21/commits/a681c9f3d3e550cc97520abd88272691170e4094
   */
  const debugAdapter = dataAdapter.containerDebugAdapter;
  const modelNames = debugAdapter.catalogEntriesByType('model');

  const store = owner.lookup('service:store');

  const models = {};

  modelNames.forEach(function (modelName) {
    let ModelClass = null;
    try {
      ModelClass = store.modelFor(modelName);
    } catch (e) {
      return;
    }

    const attributes = [];
    ModelClass.eachAttribute(function (_, descriptor) {
      attributes.push({
        key: descriptor.name,
        type: descriptor.type
      });
    });

    const relationships = [];
    ModelClass.eachRelationship(function (_, descriptor) {
      const sync = descriptor.options.async === false;
      relationships.push({
        key: descriptor.name,
        kind: descriptor.kind,
        linkTo: descriptor.type,
        async: !sync,
        inverse: descriptor.options.inverse
      });
    });

    models[modelName] = {
      attributes,
      relationships
    };
  });

  console.log(models);
  return {
    data: models
  };
}
