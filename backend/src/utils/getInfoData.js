const pick = require('lodash/pick');

module.exports.pickInfoData = (fields = [], object) => {
  return pick(object, fields);
};
