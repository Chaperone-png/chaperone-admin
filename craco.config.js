// craco.config.js
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#52c41a', // Green color for plants theme
              '@menu-item-active-bg': '#52c41a', // Selected menu item background color
              '@menu-item-selected-bg': '#f6ffed', // Selected menu item background color
              '@menu-item-selected-border-color': '#52c41a', // Selected menu item border color
              '@menu-dark-item-selected-bg': '#237804', // Dark theme selected menu item background color
              '@menu-dark-item-active-bg': '#52c41a', // Dark theme active menu item background color
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
