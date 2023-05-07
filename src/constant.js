import { deepFreeze } from 'deep-freeze-es6';

/**
 * @module Constants
 * @category API
 */

/**
 * @const {object}
 */
export const PROJECT_BOT_PREFIX = deepFreeze({
    'rest':'automaton-bot-rest-',
    'crawler':'automaton-bot-crawler-'
})

/**
 * @const {Array<object>}
 */
export const PROJECT_BOT_INCLUDE = deepFreeze([
    `@aikosia/${PROJECT_BOT_PREFIX['rest']}`,
    `@aikosia/${PROJECT_BOT_PREFIX['crawler']}`
]);

/**
 * @const {Array<object>}
 */
export const PROJECT_BOT_EXCLUDE = Object.freeze([
]);
