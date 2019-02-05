/**
 * @fileoverview Enforces explicit accessibility modifier for class members
 * @author Danny Fritz
 */

import { TSESTree } from '@typescript-eslint/typescript-estree';
import RuleModule from 'ts-eslint';
import * as util from '../util';
import { getNameFromPropertyName } from '../tsestree-utils';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

type Options = [];
type MessageIds = 'missingAccessibility';

const rule: RuleModule<MessageIds, Options> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require explicit accessibility modifiers on class properties and methods',
      extraDescription: [util.tslintRule('member-access')],
      category: 'Best Practices',
      url: util.metaDocsUrl('explicit-member-accessibility'),
      recommended: 'error'
    },
    messages: {
      missingAccessibility:
        'Missing accessibility modifier on {{type}} {{name}}.'
    },
    schema: []
  },

  create(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Checks if a method declaration has an accessibility modifier.
     * @param methodDefinition The node representing a MethodDefinition.
     */
    function checkMethodAccessibilityModifier(
      methodDefinition: TSESTree.MethodDefinition
    ): void {
      if (
        !methodDefinition.accessibility &&
        util.isTypescript(context.getFilename())
      ) {
        context.report({
          node: methodDefinition,
          messageId: 'missingAccessibility',
          data: {
            type: 'method definition',
            name: getNameFromPropertyName(methodDefinition.key)
          }
        });
      }
    }

    /**
     * Checks if property has an accessibility modifier.
     * @param classProperty The node representing a ClassProperty.
     */
    function checkPropertyAccessibilityModifier(
      classProperty: TSESTree.ClassProperty
    ): void {
      if (
        !classProperty.accessibility &&
        util.isTypescript(context.getFilename())
      ) {
        context.report({
          node: classProperty,
          messageId: 'missingAccessibility',
          data: {
            type: 'class property',
            name: getNameFromPropertyName(classProperty.key)
          }
        });
      }
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    return {
      ClassProperty: checkPropertyAccessibilityModifier,
      MethodDefinition: checkMethodAccessibilityModifier
    };
  }
};
export default rule;
export { Options, MessageIds };