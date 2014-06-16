config = {
	col: new Meteor.Collection('config'),
	allows: {},
	keys: {},

	allow: function(key, value) {
		return this.userId;
	},

	add: function(key, initValue, allow) {
		// Existing keys will already be added from collection by now
		if (typeof(this.keys[key]) != 'undefined')
			return;
		this.keys[key] = initValue;
		this.allows[key] = allow;
		this.col.insert( { key: key, value: initValue } );
	},
	set: function(key, value) {
		if (typeof(this.keys[key]) == 'undefined')
			throw new Error('[config] No such key "' + key
				+ '" exists.  Add it first with config.add("key", initValue).');
		this.col.update(
			{ key: key },
			{ $set: { value: value } }
		);
		this.keys[key] = value;
	},
	get: function(key) {
		if (typeof(this.keys[key]) == 'undefined')
			throw new Error('[config] No such key "' + key + '" exists.');
		return this.keys[key];
	}
}

var existing = config.col.find().fetch();
for (var i=0; i < existing.length; i++)
	config.keys[existing[i].key] = existing[i].value;

Meteor.methods({
	'config.set': function(key, value) {
		check(key, String);
		check(value, Match.Any);
		if (typeof(config.keys[key]) == 'undefined')
			throw new Meteor.Error(404, 'No such key');
		if (config.allows[key] && !config.allows[key].call(this, key, value))
			throw new Meteor.Error(403, 'Access denied');
		else if (!config.allow.call(this, key, value))
			throw new Meteor.Error(403, 'Access denied');
		config.set(key, value);
	}
});

Meteor.publish('config', function() {
	return config.col.find();
});

var pairs = config.col.find().fetch();
for (var i=0; i < pairs.length; i++) {
	config.keys[pairs[i].key] = pairs[i].value;
}

config.col._ensureIndex( { key: 1 } );
