module.exports = {
  lintOnSave: false,
  css: {
    extract: false,
  },
  chainWebpack: config => {
    config.externals({
      ...config.externals,
      vuex: 'Vuex',
    });
  },
};
