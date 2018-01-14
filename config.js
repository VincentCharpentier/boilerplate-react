const path = require('path');

// Configuration file for build and stuff
const prod = process.env.NODE_ENV === 'production';

module.exports = {
  buildDirectory: path.resolve(__dirname, 'dist'),
  css: {
    // [name]: chunk name
    fileName: '[name].min.css',
    // Try to keep short class names in production
    // [name]: file name ('.' -> '-')
    // [local]: class name in src code
    // [hash:mode:length]: hash
    classNameFormat: prod
      ? '[local]_[hash:base64:3]'
      : '[name]__[local]___[hash:base64:5]',
  },
};
