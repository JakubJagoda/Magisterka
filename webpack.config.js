var webpack = require("webpack");

module.exports = {
    entry: [
        './app/app.ts',
        'babel-polyfill'
    ],
    output: {
        path: './dist',
        filename: 'app.js'
    },
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components/EaselJS/lib'],
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            {test: /\.ts$/, loader: 'babel?presets[]=es2015&plugins[]=transform-runtime!ts'},
            {test: /\.json$/, loader: 'json'}
        ]
    },
    devtool: 'inline-source-map'
};
