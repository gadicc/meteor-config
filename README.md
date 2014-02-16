# config

A very small library to conveniently allow user-settable configuration
for the WebApp, with security.

## Setup

Always define your allowed variables like this:

`config.add(key [, initValue] [, allowCallback])`

If the key does not exist in the database, it will be added with
`initValue`.  See SECURITY below for the allowCallback.

## Anywhere (Client/Server)

* `config.set(key, value)` - set the value of a previously added key.
On the client this will only succeed if allowed, see SECURITY below.

* `config.get(key)` - get the value of a previously added key

## Security

By default, any key can be set by a logged in user.  You can override
this behaviour, by setting `config.allow = function(key, value)`.

You can also override the allow function for a particular key.  When
defining the key, use `config.add(key, initValue, allowCallback)`,
which is called as `allowCallBack(key, value)`.  

In both cases, return `true` to allow the set, and `false` to deny.
Note, `this` will be as per the regular this keyword in Meteor Methods,
so you can use `this.userId`.

e.g.

For all keys:

```js
config.allow = function(key, value) {
	var user = Meteor.users.findOne(this.userId);
	return !!user.isAdmin;
}
```

For specific keys:

```js
config.add('serverStopped', false, function(key, value) {
	var user = Meteor.users.findOne(this.userId);
	return !!user.isAdmin;	
});
```
