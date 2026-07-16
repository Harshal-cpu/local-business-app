const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`);

const levels = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...meta
  };

  const logString = `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}\n`;

  // Console output
  console.log(logString.trim());

  // File output
  fs.appendFileSync(logFile, logString);
}

module.exports = {
  info: (message, meta) => log(levels.INFO, message, meta),
  warn: (message, meta) => log(levels.WARN, message, meta),
  error: (message, meta) => log(levels.ERROR, message, meta)
};
