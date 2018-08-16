const rp = require('request-promise-native');
const { createServerError, createUserError } = require('../../utils');
const CONFIG = require('../../config/contactForm');
const logger = require('../../logger');

/**
 * Verify recaptcha token
 *
 * @returns {Promise<boolean>} Nothing
 */
async function recaptchaVerification(token) {
  const options = {
    method: 'POST',
    url: 'https://www.google.com/recaptcha/api/siteverify',
    qs: {
      secret: CONFIG.RECAPTCHA.SECRET,
      response: token,
    },
    json: true,
  };

  try {
    const res = await rp(options);
    if (!res.success) {
      logger.warn('Contact controller: captcha verification failed');
      throw createUserError('CaptchaVerificationFailed', 'reCaptcha verification failed');
    }
  } catch (error) {
    if (error.userError) {
      throw error;
    }
    throw createServerError('CaptchaRequestFailed', 'reCaptcha request failed');
  }
}

module.exports = {
  recaptchaVerification,
};