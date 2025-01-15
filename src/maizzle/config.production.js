import config from './config.js';
const variables = new Set();
import {render} from '@maizzle/framework';

/** @type {import('@maizzle/framework').Config} */
export default {
  ...config,
  locals: {
    dynamic: new Proxy(
      {},
      {
        get: function (target, property) {
          if (property in target) {
            return target[property];
          }
          if (typeof property === 'string' && property !== '$$typeof') {
            variables.add(property);
            return '${' + property + '}';
          }
          return property.toString();
        },
      },
    ),
  },
  afterTransformers: async function ({html, config}) {
    if (!config.page.title) {
      throw new Error('Title missing');
    }

    const subject = await render(config.page.title, {
      ...config,
      // avoiding infinite recursion
      afterTransformers: null,
    });

    html = `// auto-generated file using yarn generate:mail
// prettier-ignore
export default ({${[...variables].join(', ')}}: {${[...variables]
      .map((v) => `${v}: string`)
      .join(', ')}}) => ({
  subject: \`${subject.html}\`,
  html: \`${html}\`
});
`;
    variables.clear();
    return html;
  },
  afterBuild: async function ({files, config}) {
    console.log(files, config.build.output.path, import.meta, process.cwd());
  },
};
