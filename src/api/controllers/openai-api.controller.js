const httpStatus = require('http-status');
const openaiApi = require('../services/openai-api.service');
const logger = require('../../config/logger');

exports.transcribe = async (req, res, next) => {
  try {
    const response = await openaiApi.transcribe(req);
    if (response.status !== 200) {
      const err = response.data.error.message;
      throw new Error(err);
    }
    res.status(httpStatus.OK);
    return res.send(response);
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};

exports.summarize = async (req, res, next) => {
  try {
    logger.info(req.body);
    const response = await openaiApi.summarize(req.body);
    res.status(httpStatus.OK);
    return res.send(response);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};
