export default class EnvRequiredError extends Error {
    constructor({ path, requiredEnv }: {
        path: any;
        requiredEnv: any;
    });
}
