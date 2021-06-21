import { InheritanceMap, ModelDescriptor, ModelDescriptorMap, Relationship } from '../../interfaces';
import { transformModelName } from './common';

/*
classDiagram
class `Tag` {
  +String name
  +String image
  +Array<Content> posts
}

Tag "0" o-- "*" Content : posts

class `Content` {
  +String title
  +Object canonical
}

`Content` "0" o-- "*" `Tag`
 */

const INDENT = '  ';
const DEFAULT_TYPE = 'object';

function processRelationshipType (relationship: Relationship) {
  const linkTo = transformModelName(relationship.linkTo);
  const type = relationship.kind === 'hasMany' ? `Array<${linkTo}>` : linkTo;
  return `+${type} ${relationship.key}`;
}

function processAttributes (descriptor: ModelDescriptor) {
  const attributes = descriptor.attributes.map(attr => `${INDENT}+${attr.type || DEFAULT_TYPE} ${attr.key}`).join('\n');
  const relationshipAttrs = descriptor.relationships.map(rel => `${INDENT}${processRelationshipType(rel)}`).join('\n');

  return { attributes, relationshipAttrs };
}

function processRelationships (primaryModelName, descriptor: ModelDescriptor) {
  return descriptor.relationships.map(rel => {
    const to = transformModelName(rel.linkTo);
    const multiplicity = rel.kind === 'hasMany' ? '*' : '0..1';
    return `\`${primaryModelName}\` "" o-- "${multiplicity}" \`${to}\``
  }).join('\n');
}

function processInheritance (superModels: { [key: string]: string[] }) {
  const result = [];
  Object.keys(superModels).map(superModel => {
    const extended = superModels[superModel];
    const parent = transformModelName(superModel);
    extended.forEach(extendedModel => {
      if (extendedModel !== superModel) {
        result.push(`\`${parent}\` <|-- \`${transformModelName(extendedModel)}\``);
      }
    });
  });

  return result.join('\n')
}

export function buildGraph (map: ModelDescriptorMap, inheritanceMap: InheritanceMap): string {
  let result = '';

  Object.keys(map).forEach(originModelName => {
    const modelName = transformModelName(originModelName);
    const descriptor = map[originModelName];

    if (descriptor.attributes.length === 0 && descriptor.relationships.length === 0) {
      descriptor.attributes.push({ key: 'model', type: 'empty' });
    }

    const { attributes, relationshipAttrs } = processAttributes(descriptor);
    result += `class \`${modelName}\` {\n${attributes}\n${relationshipAttrs}\n}`;

    const relationships = processRelationships(modelName, descriptor);
    result += `\n${relationships}\n`;
  });

  const inheritance = processInheritance(inheritanceMap);
  result += `\n${inheritance}\n`;

  return `classDiagram\n${result}`;
}
