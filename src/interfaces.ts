interface Attribute {
  key: string,
  type: string
}

export interface Relationship {
  key: string,
  kind: 'hasMany' | 'belongsTo',
  linkTo: string,
  async: boolean,
  inverse: boolean
}

export interface ModelDescriptor {
  attributes: Array<Attribute>,
  relationships: Array<Relationship>
}

export type ModelDescriptorMap = { [key: string]: ModelDescriptor }

export type ProjectConfig = { error?: string, data?: ModelDescriptorMap }

