var Touchstone = {
	createApp: require('./lib/createApp'),
	Navigation: require('./lib/mixins/Navigation'),
	Dialogs: require('./lib/mixins/Dialogs'),
	Link: require('./lib/components/Link'),
	UI: require('./lib/ui'),
	Store: require('./lib/store'),
	LocalStorage: require('./lib/storage')
};

module.exports = Touchstone;
