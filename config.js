/*
|-------------------------------------------------------------------------------
| Development config               https://maizzle.com/docs/environments/#local
|-------------------------------------------------------------------------------
|
| The exported object contains the default Maizzle settings for development.
| This is used when you run `maizzle build` or `maizzle serve` and it has
| the fastest build time, since most transformations are disabled.
|
*/

module.exports = {
  build: {
    templates: {
      source: 'src/maizzle/templates',
      destination: {
        path: '.build_local',
      },
      assets: {
        source: 'src/maizzle/assets/images',
        destination: 'public',
      },
    },
    components: {
      root: 'src/maizzle/components',
    },
    layouts: {
      root: 'src/maizzle/layouts',
    },
    tailwind: {
      config: 'src/maizzle/tailwind.config.js',
      css: 'src/maizzle/assets/css/main.css',
    },
  },
  baseImageURL: '/public/',
  locals: {
    dynamic: new Proxy(
      {},
      {
        get: function (target, property) {
          if (target in target) {
            return target[property];
          } else {
            return `$${property.toString()}`;
          }
        },
      },
    ),
  },
};
