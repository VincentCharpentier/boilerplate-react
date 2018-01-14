import Helmet from 'react-helmet';

// Render Initial HTML
const renderFullPage = ({ html = '', jsBundles = [], cssBundles = [] }) => {
  const helmet = Helmet.renderStatic();
  const template = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${cssBundles
          .map(
            (bundle) =>
              `<link href="/${bundle}" rel="stylesheet" type="text/css"/>`,
          )
          .join('\n')}
        ${helmet && helmet.title && helmet.title.toString()}
      </head>
      <body>
        <div id="app_root">${html}</div>
        ${jsBundles
          .map((bundle) => `<script src="/${bundle}"></script>`)
          .join('\n')}
        <script>window.main && window.main();</script>
      </body>
    </html>
  `;
  return template;
};

const renderError = (err) => {
  let error = 'Server Error<br/>';
  if (process.env.NODE_ENV !== 'production') {
    error += `<h5 style="margin:5px 0">stack trace:</h5>
              <pre style="margin:0 10px;background:#F1F1F1;color:#F00">${
                err.stack
              }</pre>`;
  }
  return renderFullPage({
    html: error,
  });
};

module.exports = {
  renderFullPage,
  renderError,
};
