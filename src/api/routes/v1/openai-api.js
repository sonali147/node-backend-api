const express = require('express');
// const validate = require('express-validation');
const multer = require('multer');
const controller = require('../../controllers/openai-api.controller');
const logger = require('../../../config/logger');

const allowedMimeTypes = ['mpeg', 'wav', 'webm', 'mp4', 'm4a', 'x-m4a'];
// Configuration for Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `admin-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

// const multerStorage = multer.memoryStorage();

// Multer Filter
const multerFilter = (req, file, cb) => {
  logger.info(`file mimetype ${file.mimetype}`);
  const ext = file.mimetype.split('/')[1];
  if (allowedMimeTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Not a Mp3 File!!'), false);
  }
};

// Calling the "multer" Function
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const router = express.Router();

router.route('/transcribe')
  .post(upload.single('file'), controller.transcribe);

router.route('/summarize')
  .post(controller.summarize);

module.exports = router;
