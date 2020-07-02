const loader = function(source) {
  return source + "\nGM_addStyle(exports[1])";
};

module.exports = loader;