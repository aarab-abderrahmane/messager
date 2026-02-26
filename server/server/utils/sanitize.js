function sanitize(input) {
  return input.replace(/[<>]/g, '');
}

module.exports = sanitize;