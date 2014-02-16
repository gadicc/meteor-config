config = {
	col: new Meteor.Collection('config'),
	sub: Meteor.subscribe('config'),
	keys: {},

	set: function(key, value) {
		Meteor.call('config.set', key, value, function(error, result) {
			if (error) {
				console.log(error);
				throw error;
			}
			config.keys[key] = value;
		});
	},

	get: function(key) {
		if (typeof(this.keys[key]) == 'undefined') {
			if (!this.sub.ready())
				throw new Eror('[config] subscription not ready yet, no "'+key+'".');
			throw new Error('[config] Use config.add("'+key+'", initValue) on server first.');
		}
		return this.keys[key];
	}
}

config.col.find().observe({
	added: function(doc) {
		config.keys[doc.key] = doc.value;
	}
});