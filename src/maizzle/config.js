import emailVariants from 'tailwindcss-email-variants';

/** @type {import('@maizzle/framework').Config} */
export default {
  build: {
    content: ['src/maizzle/templates/**\/*.html'],
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
        'src/maizzle/templates/**/*.html',
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
};
