export function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export function getPropNameGenerator(propKey) {
  return propNameTemplate => {
    const propName = propNameTemplate.replace('{key}', propKey);
    return `${propName.charAt(0).toLocaleLowerCase()}${propName.substring(1)}`;
  };
}

export default sleep;
