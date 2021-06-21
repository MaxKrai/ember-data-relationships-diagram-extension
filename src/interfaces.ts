interface Attribute {
  key: string,
  type: string
}

export interface Relationship {
  key: string,
  kind: 'hasMany' | 'belongsTo',
  linkTo: string,
  async: boolean,
  inverse: boolean,
  polymorphic: boolean
}

export interface ModelDescriptor {
  attributes: Array<Attribute>,
  relationships: Array<Relationship>,
  extends: string
}

export type ModelDescriptorMap = { [key: string]: ModelDescriptor };
/**
 * { 'Animal': ['Cat'] }
 */
export type InheritanceMap = { [key: string]: string[] };

export interface InheritanceTreeNode {
  parent?: InheritanceTreeNode,
  children?: Array<InheritanceTreeNode>,
  name: string
}

export type InheritanceTree = { [key: string]: InheritanceTreeNode };

export interface ModelsConfig {
  descriptors: ModelDescriptorMap,
  inheritanceMap: InheritanceMap
}
export type DataConfig = { error?: string, data?: ModelsConfig };
