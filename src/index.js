import Automaton from "#src/automaton";
import * as Decorators from '#src/decorators';
import * as Constants from "#src/constant";
import App from "#src/app";
import Runtime from '#src/runtimes/runtime.v1';
import mockApp from "#mock/app";

const Tests = {
    createMockApp:mockApp
}

export { Decorators, Runtime , Constants, App, Tests};

export default Automaton;