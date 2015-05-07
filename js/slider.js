// 

function eBaySlider(options) {

	this.options = {
		slides: 'ul li'
	};
	this.mergeOptions(options);

	this.callbacks = {};

	var ajaxEmitterGroup = function () {
		this.callbacks = [];
	};

	ajaxEmitterGroup.prototype.attach = function(callback) {
		this.callbacks.push(callback);
	};

	ajaxEmitterGroup.prototype.propagate = function(args) {
		for (var x in this.callbacks) {
			this.callbacks[x].apply(this.callbacks[x], args);
		}
	};

	var ajaxCallbacksDispatcher = function() {
		this.callbackGroups = {};
	};

	ajaxCallbacksDispatcher.prototype.registerOrGet = function(key) {
		if (this.callbackGroups.hasOwnProperty(key)) return this.callbackGroups[key];
		return this.callbackGroups[key] = new ajaxEmitterGroup();
	};

	ajaxCallbacksDispatcher.prototype.get = function(key) {
		if (this.callbackGroups.hasOwnProperty(key)) {
		  return this.callbackGroups[key];
		}

		return new ajaxEmitterGroup(); // Empty one. Won't propagate and allows chaining without checking
	};

	var ajaxEmitter = function() {
		this.callbacks = new ajaxCallbacksDispatcher();
	};

	ajaxEmitter.prototype.on = function(key, callback) {
		this.callbacks.registerOrGet(key).attach(callback);
		return this;
	};

	ajaxEmitter.prototype.emit = function() {
		if (!arguments) return false;
		var args = Array.prototype.slice.call(arguments);
		var key = args.splice(0, 1);

		this.callbacks.get(key).propagate(args);
		return this;
	};

	this.emitter = new ajaxEmitter();

}

eBaySlider.prototype.mergeOptions = function(options) {
	for (var x in options) {
		this.options[x] = options[x];
	}
}

eBaySlider.prototype.on = function(event, callback) {
	this.emitter.on(event, callback);
}

eBaySlider.prototype.getThumbnailsContainer = function() {
	var thumbnails = this.options.thumbnails || false;
	if (!thumbnails) return false;

	return $(thumbnails);
}

jQuery.fn.extend({
	ebaySlider: function(options) {
		// Here comes the fun stuff
		return new eBaySlider(options);
	}
});