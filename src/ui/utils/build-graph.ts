import { ModelDescriptorMap, Relationship } from '../../interfaces';
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

function processRelationshipType (relationship: Relationship) {
  const linkTo = transformModelName(relationship.linkTo);
  const type = relationship.kind === 'hasMany' ? `Array<${linkTo}>` : linkTo;
  return `+${type} ${relationship.key}`;
}

export function buildGraph (map: ModelDescriptorMap) {
  let result = '';
  Object.keys(map).forEach(originModelName => {
    const modelName = transformModelName(originModelName);
    const descriptor = map[originModelName];
    if (descriptor.attributes.length === 0 && descriptor.relationships.length === 0) {
      return;
    }

    const attributes = descriptor.attributes.map(attr => `${INDENT}+${attr.type || 'object'} ${attr.key}`).join('\n');
    const relationshipAttrs = descriptor.relationships.map(rel => `${INDENT}${processRelationshipType(rel)}`).join('\n');
    result += `class \`${modelName}\` {\n${attributes}\n${relationshipAttrs}\n}`;
    const relationships = descriptor.relationships.map(rel => {
      const to = transformModelName(rel.linkTo);
      const multiplicity = rel.kind === 'hasMany' ? '*' : '0..1';
      return `\`${modelName}\` "" o-- "${multiplicity}" \`${to}\``
    }).join('\n');
    result += `\n${relationships}\n`;
  });

  return `classDiagram\n${result}`;
}
