const webpack = require("webpack");
const autoprefixer = require('autoprefixer');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function (env) {
    return {
        entry: [
            './app/app.tsx',
            'babel-polyfill'
        ],
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[chunkhash].js',
        },
        resolve: {
            // modulesDirectories: ['node_modules'],
            extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.scss', '.css'],
            alias: {
                'app-constants': path.join(__dirname, env.production ? 'app/constants.prod.ts' : 'app/constants.ts')
            }
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['react'],
                                    ['env', {'browsers': ['last 2 versions', 'not ie <= 10']}]
                                ],
                                plugins: ['transform-runtime']
                            }
                        },
                        {
                            loader: 'ts-loader'
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: new ExtractTextPlugin('styles-a.css').extract({
                        fallback: 'style-loader',
                        use: [{
                            loader: 'css-loader',
                            options: {
                                minimize: env.production
                            }
                        }, 'postcss-loader', 'sass-loader'],
                    })
                },
                {
                    test: /\.css$/,
                    use: new ExtractTextPlugin('styles-b.css').extract({
                        fallback: 'style-loader',
                        use: [{
                            loader: 'css-loader',
                            options: {
                                minimize: env.production
                            }
                        }, 'postcss-loader'],
                    })
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/,
                    use: ['file-loader?name=[name].[ext]']
                },
                {
                    test: /\.(jpg|png)$/,
                    use: [`file-loader?name=/static/img/[name].[ext]`]
                },
                {
                    test: /\.json$/,
                    use: ['json-loader']
                }
            ]
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor', // Specify the common bundle's name.
                minChunks: function (module) {
                    // this assumes your vendor imports exist in the node_modules directory
                    return module.context && module.context.indexOf('node_modules') !== -1;
                }
            }),
            new ExtractTextPlugin('styles.css')
        ].concat(env.production ? [
            new CleanWebpackPlugin(['dist']),
            new HtmlWebpackPlugin({
                title: 'Truth Or Bunk',
                template: './app/index.html'
            }),
            new CopyWebpackPlugin([
                {from: './app/static/img/*', to: './static/img/[name].[ext]'},
                {from: './app/static/snd/*', to: './static/snd/[name].[ext]'}
            ])
        ] : [
            new HtmlWebpackPlugin({
                title: 'App',
                template: './app/index.html'
            })
        ]),
        devtool: env.production ? 'cheap-module-source-map' : 'source-map',
        devServer: {
            contentBase: path.join(__dirname, "app"),
            inline: true,
            port: 9000,
            //potential security issue, but locally... good enough
            host: '0.0.0.0',
            disableHostCheck: true
        }
    };
};
