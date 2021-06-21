import {
  DataConfig,
  InheritanceMap,
  ModelDescriptorMap
} from '../interfaces';

declare const Ember;

export default function (): DataConfig {
  function getOwner () {
    /* eslint-disable no-underscore-dangle */
    return Ember.Namespace.NAMESPACES
      .find(namespace => namespace instanceof Ember.Application)
      .__container__;
    /* eslint-enable no-underscore-dangle */
  }

  if (!Ember) {
    return {
      error: 'Ember application is not detected or it is powered by old version of Ember (< rc5)'
    }
  }

  function getModelNames (owner) {
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
    return debugAdapter.catalogEntriesByType('model');
  }

  const owner = getOwner();
  const modelNames = getModelNames(owner);
  const store = owner.lookup('service:store');

  const models: ModelDescriptorMap = {};
  const modalClasses = {};
  const inheritanceMap: InheritanceMap = {};

  /*
   * It is important to call modelFor for all models before processing.
   * It's related to specific issue:
   * Let's say we have Animal <- Cat <- ScottishFold inheritance.
   * If modelFor is called for Animal and ScottishFold, but isn't for Cat,
   * the ScottishFold.prototype.__proto__ refers to Animal.prototype, not Cat.prototype
   */
  modelNames.forEach((modelName) => {
    let ModelClass = null;
    try {
      ModelClass = store.modelFor(modelName);
    } catch (e) {
      return;
    }

    modalClasses[modelName] = ModelClass;
  });

  modelNames.forEach((modelName) => {
    const ModelClass = modalClasses[modelName];
    if (!ModelClass) {
      return;
    }

    const attributes = [];
    ModelClass.eachAttribute((_, descriptor) => {
      attributes.push({
        key: descriptor.name,
        type: descriptor.type
      });
    });

    const relationships = [];
    ModelClass.eachRelationship((_, descriptor) => {
      const sync = descriptor.options.async === false;
      relationships.push({
        key: descriptor.name,
        kind: descriptor.kind,
        linkTo: descriptor.type,
        async: !sync,
        inverse: descriptor.options.inverse,
        polymorphic: descriptor.options.polymorphic
      });
    });

    const superModel = Object.getPrototypeOf(ModelClass.prototype).constructor.modelName;
    models[modelName] = {
      attributes,
      relationships,
      extends: superModel
    };

    if (superModel) {
      if (!inheritanceMap[superModel]) {
        inheritanceMap[superModel] = [];
      }
      inheritanceMap[superModel].push(modelName);
    }
  });

  return {
    data: {
      descriptors: models,
      inheritanceMap
    }
  };
}
