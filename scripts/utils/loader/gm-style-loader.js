const loader = function(source) {
  return source + "\nGM_addStyle(exports[0][1])";
};

module.exports = loader;