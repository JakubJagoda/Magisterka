var webpack = require("webpack");

module.exports = {
    entry: [
        './app/app.tsx',
        'babel-polyfill'
    ],
    output: {
        path: './dist',
        filename: 'app.js'
    },
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            {test: /\.tsx?$/, loader: 'babel?presets[]=es2015&plugins[]=transform-runtime!ts'},
            {test: /\.json$/, loader: 'json'}
        ]
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './app',
    }
};
