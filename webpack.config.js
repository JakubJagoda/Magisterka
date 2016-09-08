var webpack = require("webpack");
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: [
        './app/app.tsx',
        'babel-polyfill'
    ],
    output: {
        path: './dist',
        filename: 'app.js',
    },
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.scss', '.css']
    },
    module: {
        loaders: [
            {test: /\.tsx?$/, loader: 'babel?presets[]=es2015&plugins[]=transform-runtime!ts'},
            {test: /\.json$/, loader: 'json'},
            {test: /\.scss$/, loader: 'style!css!postcss!sass'},
            {test: /\.css$/, loader: 'style!css!postcss'},
            {test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file?name=[name].[ext]'}
        ]
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './app',
    },
    postcss: function () {
        return [autoprefixer];
    }
};
