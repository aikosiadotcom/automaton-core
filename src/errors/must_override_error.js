export default class MustOverrideError extends Error {
    constructor(message) {
      super(message);
      this.name = "MustOverrideError";
    }
}