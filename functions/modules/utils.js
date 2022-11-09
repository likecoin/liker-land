exports.shortenString = (s, limit = 15, skippedPartReplacer = '...') => {
  if (!s || s.length <= limit) return s;
  const trimmedLength = Math.ceil((limit - skippedPartReplacer.length) / 2);
  const [head, tail] = [
    s.substring(0, trimmedLength),
    s.substring(s.length - trimmedLength, s.length),
  ];
  return `${head}${skippedPartReplacer}${tail}`;
};
