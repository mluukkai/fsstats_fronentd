const path = require('path')
const ExtendedDefinePlugin = require('extended-define-webpack-plugin')
const NODE_MODULES = path.join(__dirname, 'node_modules/')

module.exports = (env) => {
  const plugins = []
  const now = new Date()
  const minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
  const timestamp = `${now.getDate()}.${now.getMonth() + 1} ${now.getHours()}:${minutes}`
  if (env==='production') {
    console.log('PROD')
    plugins.push (
      new ExtendedDefinePlugin({ 
        BASEURL: 'https://studies.cs.helsinki.fi/fs-stats',
        DEBUG: false,
        BUILD: timestamp,
        USERNAME: '',
        PASSWORD: ''
      })
    )
  } else {
    console.log('DEV')

    plugins.push (
      new ExtendedDefinePlugin({
        BASEURL: 'http://localhost:3000', 
        //BASEURL: 'https://studies.cs.helsinki.fi/fs-stats',
        DEBUG: true,
        BUILD: timestamp,
        USERNAME: 'testertester',
        PASSWORD: 'testertester123'
      })
    )
  }

  return {
    entry: './src/index.js',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: './app.js'
    },
    devServer: {
      port: 8000,
      contentBase: 'dist',
    }, 
    resolve: {
      modules: [
        path.join(__dirname, "src"),
          "node_modules"
        ]
    },
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['env', 'react'],
            plugins: [require('babel-plugin-transform-class-properties')]
          }
        },
        {
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader']
        }      
      ]
    },
    plugins
  }
}