/*
|-------------------------------------------------------------------------------
| Production config           https://maizzle.com/docs/environments/#production
|-------------------------------------------------------------------------------
|
| This is where you define settings that optimize your emails for production.
| These will be merged on top of the base config.js, so you only need to
| specify the options that are changing.
|
*/

const variables = new Set();

module.exports = {
  build: {
    templates: {
      source: 'src/maizzle/templates',
      destination: {
        path: 'src/maizzle/mails',
        extension: 'ts',
      },
      assets: {
        destination: '../../../artifacts/public/maizzle',
      },
    },
  },
  baseImageURL: 'https://api.kulturspektakel.de/public/maizzle/',
  inlineCSS: true,
  removeUnusedCSS: true,
  locals: {
    dynamic: new Proxy(
      {},
      {
        get: function (target, property) {
          if (property in target) {
            return target[property];
          }
          if (typeof property === 'string') {
            variables.add(property);
            return '${' + property + '}';
          }
          return property.toString();
        },
      },
    ),
  },
  events: {
    afterTransformers(html) {
      html = `// auto-generated file using yarn generate:mail
// prettier-ignore
export default ({${[...variables].join(', ')}}: {${[...variables]
        .map((v) => `${v}: string`)
        .join(', ')}}) => \`${html}\`;
`;
      variables.clear();
      return html;
    },
  },
};
