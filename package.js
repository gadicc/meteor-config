Package.describe({
    summary: "Set config variables, stored in db, client set w/ security"
});

Package.on_use(function (api) {
	api.use(['livedata', 'mongo-livedata'], ['client', 'server']);
	api.use('check', 'server')

	api.add_files('config-server.js', 'server');
	api.add_files('config-client.js', 'client');

	api.export('config', ['client', 'server']);
});
