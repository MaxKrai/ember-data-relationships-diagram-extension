import { ModelDescriptorMap } from '../../interfaces';

export function includeEverythingRelatedTo (modelName: string, map: ModelDescriptorMap): ModelDescriptorMap {
  if (!map) {
    return {};
  }

  const filteredModelMap: ModelDescriptorMap = {
    [modelName]: map[modelName]
  };

  const extractRelationships = (node) => {
    node.relationships.forEach(rel => {
      if (!filteredModelMap[rel.linkTo]) {
        filteredModelMap[rel.linkTo] = map[rel.linkTo];
        extractRelationships(map[rel.linkTo]);
      }
    });
  }

  extractRelationships(map[modelName]);

  return filteredModelMap;
}
