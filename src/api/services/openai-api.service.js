const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');
const { openaiApiKey } = require('../../config/vars');
const logger = require('../../config/logger');

const configuration = new Configuration({
  apiKey: openaiApiKey,
});
const openai = new OpenAIApi(configuration);

exports.transcribe = async (req) => {
  logger.info(req.file.path);
  let response = null;
  try {
    response = await openai.createTranscription(
      fs.createReadStream(req.file.path),
      'whisper-1',
    );
    logger.info(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    logger.error(`Error from openaiservice ${error.response}`);
    response = error.response;
  } finally {
    fs.unlink(req.file.path, (err) => {
      if (err) {
        logger.error(err);
      }
    });
    logger.info('file deleted');
  }
  return response;
};

exports.summarize = async (reqBody) => {
  logger.info('in summarize service');
  const { text } = reqBody;
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${text}\n\nTl;dr`,
    temperature: 0.7,
    max_tokens: 60,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 1,
  });
  // const response = {
  //   data: {
  //     id: 'cmpl-7IaWz2Y4efzUfCMUeW8dKjNRYG6AV',
  //     object: 'text_completion',
  //     created: 1684664685,
  //     model: 'text-davinci-003',
  //     choices: [
  //       {
  //         text: ': The 1971 Indo-Pakistani War was unique in
  // that it did not involve the issue of Kashmir, but was
  // rather precipitated by the political battle brewing in
  // erstwhile East Pakistan. This would culminate in the
  // declaration of Independence of Bangladesh from the
  // state system of Pakistan. India then intervened and',
  //         index: 0,
  //         logprobs: null,
  //         finish_reason: 'length',
  //       },
  //     ],
  //     usage: {
  //       prompt_tokens: 332,
  //       completion_tokens: 60,
  //       total_tokens: 392,
  //     },
  //   },
  // };
  return response.data;
};
