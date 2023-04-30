export default class ConstructorParamsRequiredError extends Error {
    constructor(arrayOfRequiredParams) {
      super(`Missing passing parameter : ${arrayOfRequiredParams.join(", ")} to constructor`);
      this.name = "ConstructorParamsRequiredError";
    }
}