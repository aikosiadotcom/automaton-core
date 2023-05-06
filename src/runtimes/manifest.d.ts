/**
 * @module Manifest
 * @category Runtimes
 * @subcategory Compiler
 */
/**
 * @typedef {object} Schema
 * @property {'1.0.0'} version
 * @property {module:Manifest~SCHEMA_TEMPLATE_TYPE} template
 * @property {string} profile
 * @property {module:Manifest~SCHEMA_RUN_PARAMETER} runParameter
 * @property {boolean} cronJob
 */
/**
 * @constant {Array<'rest'|'crawler'>} SCHEMA_TEMPLATE_TYPE
 */
export const SCHEMA_TEMPLATE_TYPE: string[];
/**
 * @constant {Array<'context'|'page'|'null'>} SCHEMA_RUN_PARAMETER
 */
export const SCHEMA_RUN_PARAMETER: string[];
export namespace SCHEMA_JSON_VALIDATOR {
    namespace version {
        export const required: boolean;
        export const trim: boolean;
        const _enum: string[];
        export { _enum as enum };
    }
    namespace template {
        const required_1: boolean;
        export { required_1 as required };
        const trim_1: boolean;
        export { trim_1 as trim };
        export { SCHEMA_TEMPLATE_TYPE as enum };
    }
    namespace cronjob {
        const required_2: boolean;
        export { required_2 as required };
        const trim_2: boolean;
        export { trim_2 as trim };
        export function asyncValidate(value: any, path: any, cb: any): any;
    }
    namespace runParameter {
        const required_3: boolean;
        export { required_3 as required };
        const trim_3: boolean;
        export { trim_3 as trim };
        export { SCHEMA_RUN_PARAMETER as enum };
    }
    namespace profile {
        const required_4: boolean;
        export { required_4 as required };
        const trim_4: boolean;
        export { trim_4 as trim };
    }
}
export type Schema = {
    version: '1.0.0';
    template: any;
    profile: string;
    runParameter: any;
    cronJob: boolean;
};
