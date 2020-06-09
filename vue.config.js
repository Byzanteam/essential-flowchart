module.exports = {
  lintOnSave: false,
  css: {
    extract: false,
  },
  chainWebpack: config => {
    if (process.NODE_ENV === 'production') {
      config.externals({
        ...config.externals,
        vuex: 'vuex',
      });
    }
  },
};
