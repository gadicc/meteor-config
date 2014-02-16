Package.describe({
    summary: "Set config variables from the client (with security)"
});

Package.on_use(function (api) {
	//api.use('underscore', ['client', 'server']);	
	api.add_files('config-server.js', 'server');
	api.add_files('config-client.js', 'client');
	api.export('config', ['client', 'server']);
});
