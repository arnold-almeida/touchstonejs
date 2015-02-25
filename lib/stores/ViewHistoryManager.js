/**
 * ViewHistoryManager
 *
 * @version 1.0.0
 * @author Arnold Almeida <arnold@floatingpoints.com.au>
 * 
 * @todo
 * 	 - implement immutable
 * 	 - implement backToIndex(index)
 * 	 - implement backToKey(key)
 * 	 - implement x-axis
 * 	 - implement y-axis
 * 	 - Assuming we map out axis should be able to caclulate
 * 	 	waypoints backToIndex(index) / backToKey(key)
 */
var Store     = require('../store');
var storage   = require('../storage');
var _         = require('lodash');
var crypto    = require('crypto-browserify');

// init store
var ViewHistoryStore  = module.exports = new Store();
var _viewHistory 	  = null;

// load from local storage if avaliable
try {
	_viewHistory = JSON.parse(storage._viewHistory);
} catch(e) {};

ViewHistoryStore.extend({

	init: function() {
		return {
			_history: [],
			_current: null,
			_prev: null,
		};
	},

	reset: function() {
		_viewHistory = this.init();
	},

	/**
	 * Generate a consistent key based on the params given
	 */
	_generateKey: function(key, history) {

		var hashFrom = JSON.stringify({
			key: history.key,
			transition: history.transition,
			props: history.props,
		});
		var hash = crypto.createHash('sha256').update(hashFrom).digest('hex');
		return key + '-' + hash;
	},

	back: function(index) {
		var key = this.getPrevAtIndex(index);
		return this.getHistory(key);
	},


	push: function(key, history) {

		var key = this._generateKey(key, history);

		if (_.isUndefined(key)) {
            this.noKeyError();
        }

		if (_viewHistory === null) {
			_viewHistory = this.init();
		}

		var currView = key;
		var prevView = this.getPrev();
        
		switch(true) {
        	case (currView === prevView):
        	case (_.includes(_viewHistory['_history'], key)):
        		// no op
				this._dumpHistory();
        		return false
        }



        this._saveHistory(key, history);

        this._dumpHistory();
	},

	getCurrentView: function() {
		return _viewHistory['_current'];
	},

	getPrevAtIndex: function(index) {

		if (!_.isUndefined(_viewHistory['_history'][index])) {

			// grab the history
			var history = _viewHistory['_history'][index];

			// remove the keys
			_viewHistory['_history'].splice(0, index);

			// emit the update
			this.notifyChange();

			return history;
		}

		throw new Error('No history at index [' + index + ']');
	},


	getPrev: function() {

		if (!_.isUndefined(_viewHistory['_history'][0])) {
			return _viewHistory['_history'][0];
		}

		return _viewHistory['_prev'];
	},

	getPrevAtIndex: function(index) {

		if (!_.isUndefined(_viewHistory['_history'][index])) {

			// grab the history
			var history = _viewHistory['_history'][index];

			// remove the keys
			_viewHistory['_history'].splice(0, index);

			// emit the update
			this.notifyChange();

			return history;
		}

		throw new Error('No history at index [' + index + ']');
	},


	hasPrev: function() {
		return _.isNull(_viewHistory['_prev']);
	},

	/**
	 * Returns History for a given key
	 * 
	 * @param  {string} key 
	 */
	getHistory: function(key) {
        return _viewHistory[key];
    },



    /**
     * Saves History for a given key
     *
     * Never set directly, set via push()
     * 
     * @param  {string} key     
     * @param  {mixed}  history
     */
	_saveHistory: function(key, history) {

		_viewHistory['_prev']    = (this.hasPrev()) ? this.getPrev() : key;
		_viewHistory['_current'] = key;
		_viewHistory['_history'].unshift(key);

		// Save the actual history to a key
		_viewHistory[key] = history;

		this.notifyChange();
    },

    _dumpHistory: function() {
    	_.each(_viewHistory['_history'], function(v, k) {
			console.log(k + ' : '+ v);
		});
    },

    noKeyError: function(from) {
    	throw new Error('No history key defined');
    },

    updateStorage: function() {
    	storage._viewHistory = JSON.stringify(_viewHistory);
	}

});

// Update storage when the history changes
ViewHistoryStore.addChangeListener(ViewHistoryStore.updateStorage);
