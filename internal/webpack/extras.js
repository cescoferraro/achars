const webpack = require("webpack");
let FaviconsWebpackPlugin = require('favicons-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const resolve = {
    extensions: ['.js', '.ts', '.tsx', '.json', 'pcss']
};

const LOADERS = (env, isClient)=>{
    const typed = env.production ? [] : [{
	loader: 'typed-css-modules-loader',
	options: {
	    searchDir: "**/*.pcss"
	}
    }];
    let rules = [
	{ test: /\.(pcss)$/,
	  use:[ 
	      {loader: 'isomorphic-style-loader'},
	      {loader: 'css-loader',
	       options: {importLoaders: 1,
			 sourceMap: true,
			 modules: true,
			 localIdentName: "[name]_[local]_[hash:base64:3]"}},
	      ... typed,
	      {loader: 'postcss-loader',
	       options: {
		   plugins: (loader) => [
		       require('postcss-import')({ root: loader.resourcePath }),
		       require("postcss-cssnext")({
			   browsers: '> 0%', customProperties: true,
			   colorFunction: true, customSelectors: true
		       })
		   ]
	       }}]
	},
	{ test: /\.tsx?$/, exclude: /node_modules/, loader: "ts-loader" },
	{ enforce: "pre",  exclude: /node_modules/, test: /\.js$/, loader: "source-map-loader" },
	{ test: /\.(eot|svg|ttf|otf|woff|woff2)$/,
	  use:[
	      {	loader: 'file-loader',
		options:{
		    emitFile: isClient,
		    name: "fonts/font-[sha512:hash:base64:7].[ext]"
		}}]},
        {
            test: /\.svg$/,
            exclude: /node_modules/,
            loader: 'svg-react-loader',
            query: {
                classIdPrefix: '[name]-[hash:8]__',
                propsMap: {
                    fillRule: 'fill-rule',
                    foo: 'bar'
                },
                xmlnsTest: /^xmlns.*$/
            }
        },
	{ test: /\.(jpe?g|png|gif)$/,
	  use:[
	      {loader: 'file-loader',
	       options:{
		   emitFile: isClient,
		   name: "fonts/font-[sha512:hash:base64:7].[ext]"
	       }}]}];
    return ( {rules: rules} ); 
};

const HOTLOADER = (entry, env)=>{
    if (!env.production) {
	return ['react-hot-loader/patch',
		'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&overlay=false', 
		...entry]; 
    }
    return entry;

};

const LOADERS_OPTIONS =  new webpack.LoaderOptionsPlugin({
    minimize: false,
    debug: true,
    cache: true,
    options: {
	context: '/'
    }
});

const SERVER_PLUGINS = [LOADERS_OPTIONS];
const DEVTOOLS = (env)=> {
    return  ( env.production ? "cheap-module-source-map" : "cheap-module-eval-source-map");
}; 

const CLIENT_PLUGINS = env => {
    let og = [
	new webpack.NamedModulesPlugin(),
	new webpack.NoEmitOnErrorsPlugin(),
	new FaviconsWebpackPlugin({
	    prefix: 'icons/',
	    logo: './shared/icon/favicon.png'
	}),
	new webpack.optimize.ModuleConcatenationPlugin(),
	LOADERS_OPTIONS
    ];

    if (env.production){
	og.push(
	    new CopyWebpackPlugin([ {from: "./server/server.js",to:"./server.js"} ]),
	    new CopyWebpackPlugin([ {from: "./server/index.html",to:"./index.html"} ]),
	    new CopyWebpackPlugin([ {from: "./shared/FB35B4FE618262EF0B9F299C03184A31.txt",
				     to:"./ssl/FB35B4FE618262EF0B9F299C03184A31.txt"} ]),
	    new webpack.optimize.CommonsChunkPlugin({
		name: "react-vendor",
		filename: "vendor/react.js",
		chunks: ["client", "react"]
	    }),
	    new webpack.optimize.CommonsChunkPlugin({
		name: "rxjs-vendor",
		filename: "vendor/rxjs.js",
		chunks: ["client", "rxjs"]
	    }),
	    new webpack.optimize.CommonsChunkPlugin({
		name: "material-vendor",
		filename: "vendor/material.js",
		chunks: ["client", "material"]
	    }),
	    new webpack.optimize.CommonsChunkPlugin({
		name: "firebase-vendor",
		filename: "vendor/firebase.js",
		chunks: ["client", "firebase"]
	    })
	);
    } else {
	og.push(
	    new webpack.HotModuleReplacementPlugin(),
	    new webpack.DllReferencePlugin({
		context: process.cwd(),
		sourceType: "var",
		manifest: require("../../dll/vendor.json")
	    }),
	    new webpack.optimize.CommonsChunkPlugin({
		name: "dev",
		filename: "js/dev.js", chunks: ["client", "vendor"]
	    })	);
    }
    if(env.analyzer){
	og.push(new BundleAnalyzerPlugin());
    }
    return og;
};

module.exports = {
    resolve: resolve,
    SERVER_PLUGINS: SERVER_PLUGINS,
    HOTLOADER:HOTLOADER,
    DEVTOOLS: DEVTOOLS,
    CLIENT_PLUGINS: CLIENT_PLUGINS,
    LOADERS: LOADERS 
};
