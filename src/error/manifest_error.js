export default class ManifestError extends Error {
    constructor(message) {
      super(`${JSON.stringify(message)}`);
      this.name = "ManifestError";
    }
}