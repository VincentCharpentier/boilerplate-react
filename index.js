const config = require('./config');
require('@babel/polyfill');
require('@babel/register')();
const csshook = require('css-modules-require-hook');
csshook({
  generateScopedName: config.css.classNameFormat,
  // processCss: function (css, filepath) { console.log(2,css); }
});

(function InitNode() {
  // Extends require to support webpack specific "require.ensure" & "require.include" during SSR
  let proto = Object.getPrototypeOf(require);
  !proto.hasOwnProperty('ensure') &&
    Object.defineProperties(proto, {
      ensure: {
        value: function ensure(modules, callback) {
          callback(this);
        },
        writable: false,
      },
      include: {
        value: function include() {},
        writable: false,
      },
    });
})();

require('./server/server');
