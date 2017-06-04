const path = require('path');
const extras = require("./extras.js");

module.exports = ( env = {production:false}) => {
    return ( {
	name: 'client',
	target: 'web',
	entry: extras.HOTLOADER(['./client/client'],env),
	output: {
	    path:  path.join(__dirname, '../../dist'),
	    filename: 'js/client.js'
	},
	devtool: extras.DEVTOOLS(env),
	plugins: extras.CLIENT_PLUGINS(env,true), 
	module:  extras.LOADERS(env),
	resolve: extras.resolve 
    } ); };