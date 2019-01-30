/**
 * @fileoverview Disallow aliasing `this`
 * @author Jed Fox
 */

import RuleModule from '../RuleModule';
import * as util from '../util';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const defaultOptions = [
  {
    allowDestructuring: false,
    allowedNames: [] as string[]
  }
];

const rule: RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow aliasing `this`',
      extraDescription: [util.tslintRule('no-this-assignment')],
      category: 'Best Practices',
      url: util.metaDocsUrl('no-this-alias'),
      recommended: false
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          allowDestructuring: {
            type: 'boolean'
          },
          allowedNames: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      }
    ],
    messages: {
      thisAssignment: "Unexpected aliasing of 'this' to local variable.",
      thisDestructure:
        "Unexpected aliasing of members of 'this' to local variables."
    }
  },

  create(context: Rule.RuleContext) {
    const { allowDestructuring, allowedNames } = util.applyDefault(
      defaultOptions,
      context.options
    )[0];

    return {
      "VariableDeclarator[init.type='ThisExpression']"(node) {
        const { id } = node;

        if (allowDestructuring && id.type !== 'Identifier') return;

        if (!allowedNames.includes(id.name)) {
          context.report({
            node: id,
            messageId:
              id.type === 'Identifier' ? 'thisAssignment' : 'thisDestructure'
          });
        }
      }
    };
  }
};
export = rule;
