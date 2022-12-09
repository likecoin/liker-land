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

export default sleep;
