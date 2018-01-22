const webpack = require('webpack');
const path = require('path');
const poststylus = require('poststylus');
const ExtractTestPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        vendor: ['babel-polyfill', 'react', 'react-dom', 'react-bootstrap',
            'jquery', 'redux', 'react-redux', 'recompose', 'moment', 'bootstrap', 'react-router-dom',
            'redux-actions', 'lodash-es', 'react-router-bootstrap'],
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
        new ExtractTestPlugin('app.css'),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.LoaderOptionsPlugin({
            stylus: {
                use: poststylus(['autoprefixer'])
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    }
};