import {
  InheritanceTreeNode,
  InheritanceMap,
  InheritanceTree,
  ModelDescriptor,
  ModelDescriptorMap
} from '../../interfaces';

/**
 * It returns all
 */
export function includeEverythingRelatedTo (modelName: string, descriptors: ModelDescriptorMap, inheritanceMap: InheritanceMap, inheritanceTree: InheritanceTree): { descriptors: ModelDescriptorMap, inheritanceMap: InheritanceMap } {
  if (!descriptors) {
    return;
  }

  const extractRelationshipsAndInheritance = (currentModelName, previousModelMap: ModelDescriptorMap = {}, previosInheritanceMap: InheritanceMap = {}) => {
    let filteredModelMap: ModelDescriptorMap = {
      ...previousModelMap,
      [currentModelName]: descriptors[currentModelName]
    };
    let filteredInheritanceMap: InheritanceMap = {
      ...previosInheritanceMap
    };

    const extractInheritanceMap = (node: InheritanceTreeNode, map: InheritanceMap) => {
      if (!node || map[node.name]) {
        return;
      }
      if (node.children) {
        map[node.name] = node.children.map(childNode => childNode.name);
        node.children.forEach(childNode => extractInheritanceMap(childNode, map));
      }
    };

    const extractRelationships = (node: ModelDescriptor, currentModelName: string) => {
      node.relationships.forEach(rel => {
        if (!filteredModelMap[rel.linkTo]) {
          filteredModelMap[rel.linkTo] = descriptors[rel.linkTo];
          extractRelationships(descriptors[rel.linkTo], rel.linkTo);
        }
      });

      let inheritanceTreeNode = inheritanceTree[currentModelName];
      if (inheritanceTreeNode) {
        while (inheritanceTreeNode.parent) {
          inheritanceTreeNode = inheritanceTreeNode.parent;
        }
        extractInheritanceMap(inheritanceTreeNode, filteredInheritanceMap);
      }
    };

    extractRelationships(descriptors[currentModelName], currentModelName);

    const allModelsFromInheritance = Object.keys(filteredInheritanceMap).reduce((res, parentModel) => {
      res.add(parentModel);
      filteredInheritanceMap[parentModel].forEach(childModel => {
        res.add(childModel);
      });
      return res;
    }, new Set<string>());

    const diff = {};
    allModelsFromInheritance.forEach(inheritanceModel => {
      if (!filteredModelMap[inheritanceModel]) {
        diff[inheritanceModel] = descriptors[inheritanceModel];
      }
    });

    const diffKeysArray = Object.keys(diff);
    if (diffKeysArray.length > 0) {
      diffKeysArray.forEach(diffKey => {
        const { filteredModelMap: diffModelMap, filteredInheritanceMap: diffInheritanceMap } =
            extractRelationshipsAndInheritance(diffKey, filteredModelMap, filteredInheritanceMap);
        filteredModelMap = {
          ...filteredModelMap,
          ...diffModelMap
        };
        filteredInheritanceMap = {
          ...filteredInheritanceMap,
          ...diffInheritanceMap
        };
      })
    }

    return { filteredModelMap, filteredInheritanceMap };
  }

  const { filteredModelMap, filteredInheritanceMap } = extractRelationshipsAndInheritance(modelName);

  return { descriptors: filteredModelMap, inheritanceMap: filteredInheritanceMap };
}
