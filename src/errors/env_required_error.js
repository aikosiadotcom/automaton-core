export default class EnvRequiredError extends Error {
    constructor({path,requiredEnv}) {
      // super(`Please create a .env file in your root project contains following variable: ${arrayOfRequiredEnv.join(", ")}.`);
      super(`Please create a .env file contains following variable: ${requiredEnv.join(", ")}. You can save it as local to your root directory of the project '${process.cwd()}' or as global to '${path}'`);
      this.name = "EnvRequiredError";
    }
}