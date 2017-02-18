/**
 * @author: @AngularClass
 */
/**
 The MIT License (MIT)

 Copyright (c) 2015-2016 AngularClass LLC

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

var webpack = require('webpack');
var helpers = require('./helpers'); // Helper: root(), and rootDir() are defined at the bottom
var webpackMerge = require('webpack-merge'); //Used to merge webpack configs
var commonConfig = require('./webpack.common.js'); //The settings that are common to prod and dev

/**
 * Webpack Plugins
 */
var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = function (metadata) {
  return webpackMerge(commonConfig(metadata), {

    // Developer tool to enhance debugging
    //
    // See: http://webpack.github.io/docs/configuration.html#devtool
    // See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
    devtool: 'source-map',

    // Options affecting the output of the compilation.
    //
    // See: http://webpack.github.io/docs/configuration.html#output
    output: {

      // The output directory as absolute path (required).
      //
      // See: http://webpack.github.io/docs/configuration.html#output-path
      path: helpers.root('dist'),

      // Specifies the name of each output file on disk.
      // IMPORTANT: You must not specify an absolute path here!
      //
      // See: http://webpack.github.io/docs/configuration.html#output-filename
      filename: '[name].[chunkhash].bundle.js',

      // The filename of the SourceMaps for the JavaScript files.
      // They are inside the output.path directory.
      //
      // See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
      sourceMapFilename: '[name].[chunkhash].bundle.map',

      // The filename of non-entry chunks as relative path
      // inside the output.path directory.
      //
      // See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
      chunkFilename: '[id].[chunkhash].chunk.js'

    },

    // Add additional plugins to the compiler.
    //
    // See: http://webpack.github.io/docs/configuration.html#plugins
    plugins: [

      // Plugin: DedupePlugin
      // Description: Prevents the inclusion of duplicate code into your bundle
      // and instead applies a copy of the function at runtime.
      //
      // See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
      // See: https://github.com/webpack/docs/wiki/optimization#deduplication
      // new DedupePlugin(),

      // Plugin: DefinePlugin
      // Description: Define free variables.
      // Useful for having development builds with debug logging or adding global constants.
      //
      // Environment helpers
      //
      // See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
      // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
      new DefinePlugin({
        'ENV': JSON.stringify(metadata.ENV),
        'HMR': metadata.HMR,
        'SITE_TITLE': JSON.stringify(metadata.title),
        'process.env': {
          'ENV': JSON.stringify(metadata.ENV),
          'NODE_ENV': JSON.stringify(metadata.ENV),
          'HMR': metadata.HMR,
        }
      }),

      // Plugin: UglifyJsPlugin
      // Description: Minimize all JavaScript output of chunks.
      // Loaders are switched into minimizing mode.
      //
      // See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
      new UglifyJsPlugin({
        // beautify: true, //debug
        // mangle: false, //debug
        // dead_code: false, //debug
        // unused: false, //debug
        // deadCode: false, //debug
        // compress: {
        //   screw_ie8: true,
        //   keep_fnames: true,
        //   drop_debugger: false,
        //   dead_code: false,
        //   unused: false
        // }, // debug
        // comments: true, //debug

        beautify: false, //prod
        output: {
          comments: false
        }, //prod//prod
        mangle: {
          screw_ie8: true
        }, //prod
        compress: {
          screw_ie8: true,
          warnings: false,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          negate_iife: false // we need this for lazy v8
        }
      }),

      // Plugin: CompressionPlugin
      // Description: Prepares compressed versions of assets to serve
      // them with Content-Encoding
      //
      // See: https://github.com/webpack/compression-webpack-plugin
      new CompressionPlugin({
        regExp: /\.css$|\.html$|\.js$|\.map$/,
        threshold: 2 * 1024
      }),

      new webpack.LoaderOptionsPlugin({
        debug: false,
        minimize: true,
        options: {

          // Html loader advanced options
          //
          // See: https://github.com/webpack/html-loader#advanced-options
          // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor


          htmlLoader: {
            minimize: true,
            removeAttributeQuotes: false,
            caseSensitive: true,
            customAttrSurround: [
              [/#/, /(?:)/],
              [/\*/, /(?:)/],
              [/\[?\(?/, /(?:)/]
            ],
            customAttrAssign: [/\)?\]?=/]
          },

          // Static analysis linter for TypeScript advanced options configuration
          // Description: An extensible linter for the TypeScript language.
          //
          // See: https://github.com/wbuchwalter/tslint-loader
          tslint: {
            emitErrors: true,
            failOnHint: true,
            resourcePath: 'src'
          },
          semanticUiLessModuleLoader: {
            siteFolder:helpers.root('src/assets/site'),
            themePath: helpers.root('src/assets/site/theme.less')
          }
        }
      })

    ],
    node: {
      global: true,
      crypto: 'empty',
      process: false,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  });
};
