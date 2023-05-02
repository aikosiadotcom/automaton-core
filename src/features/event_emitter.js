import parallel from "@trenskow/parallel";

/**
 * @async
 * @callback CallbackEventHandler
 * @param {...any} args
 */

/**
 * a class that contains ability to implement event-driven paradigm.
 */
class EventEmitter {
	constructor() {
		this._nextIdentifier = -1;
		this._listeners = {};
	}

    /**
	 * subscribe / listen to spesific event and define how to handle it when the event is triggered
	 * 
     * @param {string} event - what is the name of event to listen
	 * @param {CallbackEventHandler} handler - how to react when the event is triggered
     * @returns {number} identifier associated to this handler.
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
	 * unsubscribe from a event
	 * 
     * @param {string} event - what is the name of event to unsubscribe
	 * @param {number} identifier identifier associated to the handler
	 */
	remove(event, identifier) {
		if (typeof this._listeners[event] === 'undefined') return;
		this._listeners[event] = this._listeners[event].filter((listener) => {
			return listener.identifier != identifier;
		});
	}

	/**
	 *	similar to [AsyncEventEmitter's on method]{@link EventEmitter#on}
	 *	the difference is when the event is triggered, handler will be remove after executed.
	 * 
     * @param {string} event - what is the name of event to listen
	 * @param {(Promise|Function)} handler - how to react when the event is triggered
	 */
	once(event, handler) { 
		const identifier = this.on(event, async (...args) => {
			this.remove(event,identifier);
			await handler(...args);
		});
	}

	/**
	 * publish / trigger a event to all subscribers / listeners
	 * 
 	 * @param {string} event - what is the name of event to publish
	 * @param  {...any} args - this argument will pass to the handler
	 * 
	 * @todo coba pikirkan ini ke depan mungkin bisa diimplementasikan seperti plugin dimana return dari handler sebelumnya bisa jadi input bagi handler berikutnya
	 */
	async emit(event, ...args) {
		await parallel((this._listeners[event] || []).map(async (listener) => {
			await listener.handler(...args);
		}));
	}
}

export default EventEmitter;