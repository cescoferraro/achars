var path = require("path");
var webpack = require("webpack");


module.exports = (env)=>( {
    entry: {
        vendor: require("./libs.js") 
    },
    output: {
        path: path.join(__dirname, "../../dll"),
        filename: "[name].js",
        library: "[name]" ,
        libraryTarget: "var"
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, "../../dll", "[name].json"),
            name: "[name]",
            context: path.resolve(__dirname, "client")
        }),
    ]
});
