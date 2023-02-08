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

export default sleep;
