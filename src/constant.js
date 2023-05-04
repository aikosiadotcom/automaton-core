import { deepFreeze } from 'deep-freeze-es6';

/**
 * @module Constants
 * @category API
 */

/**
 * @const {object}
 */
export const PLUGIN_NAMING_PREFIX = deepFreeze({
    'rest':'automaton-plugin-rest-',
    'crawler':'automaton-plugin-crawler-'
})

/**
 * @const {Array<object>}
 */
export const PLUGIN_INCLUDE_REGEX = deepFreeze([
    `@aikosia/${PLUGIN_NAMING_PREFIX['rest']}`,
    `@aikosia/${PLUGIN_NAMING_PREFIX['crawler']}`
]);

/**
 * @const {Array<object>}
 */
export const PLUGIN_EXCLUDE_REGEX = Object.freeze([
]);
