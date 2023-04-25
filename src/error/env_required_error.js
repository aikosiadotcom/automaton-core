export default class EnvRequiredError extends Error {
    constructor(arrayOfRequiredEnv) {
      super(`Please create a .env file in your root project contains following variable: ${arrayOfRequiredEnv.join(", ")}.`);
      this.name = "EnvRequiredError";
    }
}