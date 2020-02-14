const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

// ルートディレクトリの設定  - - - - - - - - - - - - - - - - - - - - -

const rootDir = '/public'

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const webpack_config = {
  entry: {
    main: [path.resolve(__dirname, './src/javascripts/entry.js')],
  },
  output: {
    path: path.resolve(__dirname, '../htdocs' + rootDir),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name(file) {
                if ( file.includes('index') ) {
                  return '[name].html'
                }else {
                  return '[name]/index.html'
                }
              },
              url: false
            }
          },
          'extract-loader',
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', ':data-src']
            }
          },
          {
            loader: 'pug-html-loader',
            options: {
              pretty: true
            }
          }
        ]
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        loader: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    // new CopyPlugin([
    //   { from: 'src/materials/json/',
    //     to: 'materials/json/'
    //   },
    // ]),
    // new CopyPlugin([
    //   {
    //     from: 'src/materials/favicon/',
    //     to: './'
    //   }
    // ])
    new CopyPlugin([
      {
        from: './favicon.ico',
        to: './'
      }
    ]),
    new CopyPlugin([
      {
        from: './src/materials/cubemap/texture.png',
        to: './materials/'
      }
    ]),
    new CopyPlugin([
      {
        from: './src/materials/maskingNoise/heart.glb',
        to: './materials/'
      }
    ])
  ]
};

module.exports = {
  webpack_config,
  rootDir
}
