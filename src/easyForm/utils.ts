export function omit(obj: { [key: string]: any }, props: string[]) {
  let result: { [key: string]: any } = {};

  Object.keys(obj).forEach(key => {
    if (!props.includes(key)) {
      result[key] = obj[key];
    }
  })

  return result;
}

export function haveChildren<T extends { children?: any[] }>(item: T) {
  return !!(Array.isArray(item.children) && item.children.length > 0)
}

export function error(error: string) {
  throw new Error(`Easy-antd-form: ${error}`);
}