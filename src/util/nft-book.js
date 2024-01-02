import querystring from 'querystring';

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

export function getFilenameFromURL(url) {
  const qsStr = url.split('?').pop();
  const qs = querystring.parse(qsStr);
  return qs?.name || '';
}

export function getDownloadFilenameFromURL(url) {
  return `${getFilenameFromURL(url) || 'content'}`;
}
