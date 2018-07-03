const WEB_CONFIG = require('../config/web');
const logger = require('../logger');

async function start() {
  if (process.env.NODE_ENV === 'production') return;

  logger.info('Starting ngrok...');

  // eslint-disable-next-line import/no-extraneous-dependencies,global-require
  const ngrok = require('ngrok');
  WEB_CONFIG._currentPublicURL = await ngrok.connect(process.env.PORT || 3000);
  logger.info(`Back is live at ${WEB_CONFIG._currentPublicURL}`);
}


module.exports = {
  start,
};
