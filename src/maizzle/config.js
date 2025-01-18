import emailVariants from 'tailwindcss-email-variants';
import {markdownToTxt} from 'markdown-to-txt';

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
    inline: true,
    tailwind: {
      plugins: [emailVariants],
      content: [
        'src/maizzle/templates/**/*.md',
        'src/maizzle/components/**/*.html',
      ],
      theme: {
        extend: {
          colors: {
            brand: {
              500: '#E12E2E',
            },
          },
        },
      },
    },
  },
  beforeRender: async ({html, config}) => {
    config._text = markdownToTxt(html).trim();
    return `<x-main><md>${html}</md></x-main>`;
  },
};
