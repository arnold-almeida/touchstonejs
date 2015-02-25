var _ = require('underscore');

var Store = function(ext) {
	var _changeListeners = [];
	this.notifyChange = function() {
		_changeListeners.forEach(function(listener) {
    		listener();
		});
	},
	this.addChangeListener = function(listener) {
		_changeListeners.push(listener);
	},
	this.removeChangeListener = function(listener) {
		_changeListeners = _changeListeners.filter(function (l) {
			return listener !== l;
		});
	}
	_.extend(this, ext);
}

Store.prototype.extend = function(ext) {
	_.extend(this, ext);
	return this;
}

module.exports = Store;
