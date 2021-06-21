import { InheritanceTree, InheritanceMap } from '../../interfaces';

export function makeInheritanceTree (inheritanceMap: InheritanceMap): InheritanceTree {
  const tree: InheritanceTree = {};
  Object.keys(inheritanceMap).map(modelName => {
    if (!tree[modelName]) {
      tree[modelName] = { name: modelName };
    }
    const parent = tree[modelName];

    inheritanceMap[modelName].forEach(childModel => {
      if (!tree[childModel]) {
        tree[childModel] = { name: childModel };
      }
      tree[childModel].parent = parent;
    });

    tree[modelName].children = [...inheritanceMap[modelName].map(childModel => {
      return tree[childModel];
    })];
  });

  return tree;
}
