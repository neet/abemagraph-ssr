const webpack = require('webpack');
const path = require('path');
const poststylus = require('poststylus');
const ExtractTestPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        vendor: ['babel-polyfill', 'react', 'react-dom', 'react-router-dom',
            'jquery', 'redux', 'react-redux', 'recompose', 'moment', 'bootstrap',
            'redux-actions', 'lodash-es', 'tslib', 'highcharts/highstock'],
        app: ['./src/views/index.tsx']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'assets')
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'awesome-typescript-loader',
                    options: {
                        useBabel: true,
                        'babelOptions': {
                            'babelrc': false,
                            'presets': [
                                ['es2015']
                            ]
                        }
                    }
                }]
            },
            {
                test: /\.styl$/,
                use: ExtractTestPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'stylus-loader'
                    ]
                })
            },
            {
                test: /\.css$/,
                use: ExtractTestPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader'
                    ]
                })
            },
            {
                test: /\.(ttf|otf|woff2?|eot|svg)$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.LoaderOptionsPlugin({
            stylus: {
                use: poststylus(['autoprefixer'])
            }
        }),
        new ExtractTestPlugin('app.css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity,
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: { 'lodash': 'lodash-es' }
    }
};