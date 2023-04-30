export default class AbstractClassError extends Error {
    constructor() {
      super("Can't instantiate abstract class!");
      this.name = "AbstractClassError";
    }
}