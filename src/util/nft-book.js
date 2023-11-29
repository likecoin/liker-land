const getDynamicCoversSrc = require.context(
  `../assets/images/nft/books/covers`,
  false
);

export function getDynamicCovers(classId, editionIndex) {
  return getDynamicCoversSrc
    .keys()
    .filter(file => file.includes(`./${classId}-${editionIndex}`))
    .map(file => getDynamicCoversSrc(file));
}

export default getDynamicCovers;
