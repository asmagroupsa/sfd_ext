const webpack = require('webpack');
const writeFilePlugin = require('write-file-webpack-plugin');
const webpackMerge = require('webpack-merge');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');

const commonConfig = require('./webpack.common.js');

const ddlPath = './target/www/vendor.json';
const ENV = 'dev';

if (!fs.existsSync(ddlPath)) {
  execSync('webpack --config webpack/webpack.vendor.js');
}

module.exports = webpackMerge(commonConfig({ env: ENV }), {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './target/www',
        proxy: [{
            context: [
                '/carmesfnmservice',
                /* jhipster-needle-add-entity-to-webpack - JHipster will add entity api paths here */
                '/api',
                '/management',
                '/swagger-resources',
                '/v2/api-docs',
                '/h2-console'
            ],
            target: 'http://185.98.137.71:8989',
            secure: false
        }]
    },
    output: {
        path: path.resolve('target/www'),
        filename: 'app/[name].bundle.js',
        chunkFilename: 'app/[id].chunk.js'
    },
    module: {
        rules: [{
            test: /\.ts$/,
            loaders: ['tslint-loader'],
            exclude: [
                'node_modules',
                new RegExp('reflect-metadata\\' + path.sep + 'Reflect\\.ts')
            ]
        }]
    },
    plugins: [
          new BrowserSyncPlugin(
              {
                host: 'localhost',
                port: 9003, //9003,// 
                proxy: {
                  target: 'http://localhost:9063'
                }
              },
              {
                reload: false
              }
            ), 

        new ExtractTextPlugin('styles.css'),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
        new writeFilePlugin(),
        new webpack.WatchIgnorePlugin([path.resolve('./src/test')])
    ]
  
});
