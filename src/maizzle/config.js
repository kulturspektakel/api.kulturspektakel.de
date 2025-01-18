import emailVariants from 'tailwindcss-email-variants';
import {marked} from 'marked';

function markdownToText(markdown) {
  const renderer = new marked.Renderer();

  (renderer.list = (list) =>
    list.items
      .map(
        (item, i) =>
          `${list.ordered ? `${i + 1 + (list.start || 0)}.` : '-'} ${item.text.split('\n').join('\n  ')}`,
      )
      .join('\n') + '\n\n'),
    (renderer.listitem = () => '');
  renderer.paragraph = function ({text, tokens, parser}) {
    `${this.parser.parseInline(tokens)}\n\n`;
  };
  renderer.text = ({text}) => text;
  renderer.link = ({href, text}) => `${text} (${href})`;
  renderer.heading = ({text}) => `${text}\n\n`;
  renderer.strong = ({text, raw}) => text + raw;
  renderer.text = ({text}) => {
    console.log('👋 test', text);
  };
  renderer.em = ({text, raw}) => text + raw;
  renderer.br = () => {};

  return marked.use({
    renderer,
  })(markdown.replace(/<br \/>/gm, '<br>'));
}

/** @type {import('@maizzle/framework').Config} */
export default {
  build: {
    content: ['src/maizzle/templates/**\/*.md'],
    static: {
      source: ['src/maizzle/assets/**/*'],
      destination: '../../../artifacts/public/maizzle',
    },
    output: {
      path: 'src/maizzle/generated',
      from: 'src/maizzle/templates',
      extension: 'ts',
    },
  },
  components: {
    root: 'src/maizzle',
    folders: ['components'],
  },
  baseURL: 'https://api.kulturspektakel.de/public/maizzle/',
  css: {
    purge: true,
    tailwind: {
      plugins: [emailVariants],
      content: [
        'src/maizzle/templates/**/*.md',
        'src/maizzle/components/**/*.html',
      ],
      theme: {
        extend: {
          colors: {
            offwhite: {
              100: '#f6f5f0',
              200: '#dbd8d3',
              300: '#d0cabc',
              400: '#b6b39f',
              500: '#9c9686',
              600: '#5a574e',
            },
            brand: {
              500: '#E12E2E',
              900: '#100A28',
            },
          },
          boxShadow: {
            xs: '0px 1px 2px #dbd8d3, 0px 0px 1px #dbd8d3',
          },
        },
      },
    },
  },
  beforeRender: async ({html, config}) => {
    config._text = markdownToText(html).trim();
    return `<x-main><md>${html}</md></x-main>`;
  },
};
