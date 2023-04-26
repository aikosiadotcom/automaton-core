export default class EnvRequiredError extends Error {
    constructor({path,requiredEnv}) {
      // super(`Please create a .env file in your root project contains following variable: ${arrayOfRequiredEnv.join(", ")}.`);
      super(`Please create a .env file in ${path} contains following variable: ${requiredEnv.join(", ")}.`);
      this.name = "EnvRequiredError";
    }
}