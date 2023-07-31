export function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export function getPropNameGenerator(propKey) {
  return propNameTemplate => {
    const propName = propNameTemplate.replace('{key}', propKey);
    return `${propName.charAt(0).toLocaleLowerCase()}${propName.substring(1)}`;
  };
}

export function catchAxiosError(promise) {
  return promise.catch(e => {
    if (e.response?.status !== 404) {
      // eslint-disable-next-line no-console
      console.error(JSON.stringify(e));
    }
  });
}

export function fisherShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line no-param-reassign
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function escapeCSVField(field) {
  if (field.includes('"') || field.includes(',')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function downloadCSV(csvString, filename) {
  const csvBlob = new Blob([csvString], {
    type: 'text/csv;charset=utf-8;',
  });

  const csvUrl = URL.createObjectURL(csvBlob);
  const hiddenLink = document.createElement('a');
  hiddenLink.href = csvUrl;
  hiddenLink.target = '_blank';
  hiddenLink.download = filename;
  hiddenLink.click();
}

export function unescapeHtml(text = '') {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

export function escapeHtml(text = '') {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default sleep;
