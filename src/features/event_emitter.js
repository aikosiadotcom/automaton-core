import parallel from "@trenskow/parallel";

/**
 * 
 * @async
 * @callback EventEmitter~EventHandler
 * @param {...any} args
 * 
 * @example 
 * 
 * const eventHandler = async(...args)=>console.log(...args);
 */

/**
 * Implementation of Event Paradigma Programming that allows for registering, removing, and emitting events with asynchronous handlers.
 * 
 * @category Features
 * @subcategory Feature
 * @example
 * import EventEmitter from "./event_emitter.js";
 * 
 * const event = new EventEmitter();
 * const handler = async(args)=>console.log(...args);
 * const identifier = event.on("log",handler);
 * await event.emit("log",1,2,3);//handler will be called and you'll see 1 2 3 on console terminal
*/
class EventEmitter {
	constructor() {
		this._nextIdentifier = -1;
		this._listeners = {};
	}

	/**
	 * This function adds an event listener to an object and returns an identifier for the listener.
	 * @param {string} event - a string representing the name of the event to listen for.
	 * @param {EventEmitter~EventHandler} handler - The function that will be executed when the event is triggered.
	 * @returns {number} - handler identifier
	 * 
	 * @example
	 * 
	 * const identifier = event.on("log",handler);
	 */
	on(event, handler) {
		this._listeners[event] = this._listeners[event] || [];
		this._listeners[event].push({
			handler,
			identifier: ++this._nextIdentifier
		});
		return this._nextIdentifier;
	}

	/**
	 * This function removes a specific listener from an event in a JavaScript object.
	 * @param {string} event - The event parameter is a string that represents the name of the event from which the
	 * listener needs to be removed.
	 * @param {number} identifier - The identifier is a unique value that is used to identify a specific listener
	 * that needs to be removed from the event. It is used to match the listener that needs to be removed
	 * from the list of listeners for the specified event.
	 * @returns If the `event` parameter is not defined in the `_listeners` object, the function returns
	 * `undefined`. Otherwise, it returns void
	 * 
	 * @example
	 * 
	 * event.remove("log",identifier);
	 */
	remove(event, identifier) {
		if (typeof this._listeners[event] === 'undefined') return;
		this._listeners[event] = this._listeners[event].filter((listener) => {
			return listener.identifier != identifier;
		});
	}

	/**
	 * The "once" function adds an event listener that will only trigger once and then remove itself.
	 * @param {string} event - The event that the handler function should be triggered on.
	 * @param {EventEmitter~EventHandler} handler - The handler is a function that will be executed when the specified event occurs. It
	 * takes in any number of arguments (represented by the spread operator `...args`) that are passed to
	 * the event. The `async` keyword indicates that the function may contain asynchronous code that needs
	 * to be awaited.
	 * 
	 * @example
	 * 
	 * event.once("log",handler);
	 */
	once(event, handler) { 
		const identifier = this.on(event, async (...args) => {
			this.remove(event,identifier);
			await handler(...args);
		});
	}

	/**
	 * This is an asynchronous function that emits an event and executes all the listeners associated with
	 * that event in parallel.
	 * @param {string} event - The name of the event being emitted.
	 * @param {...any} args - The `args` parameter is a rest parameter that allows the function to accept any number
	 * of arguments after the `event` parameter. These arguments will be passed to the event listeners as
	 * arguments when the event is emitted.
	 * 
	 * @example
	 * 
	 * await event.emit("log",1,2,3);
	 * 
	 * @async
	 * @todo support for pipe (output from current handler will become input for next handler)
	 */
	async emit(event, ...args) {
		await parallel((this._listeners[event] || []).map(async (listener) => {
			await listener.handler(...args);
		}));
	}
}

export default EventEmitter;