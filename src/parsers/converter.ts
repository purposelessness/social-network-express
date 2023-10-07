function serializeObject(obj: any): any {
  const json: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'bigint') {
        json[key] = serialize(value.toString());
      } else {
        json[key] = serialize(value);
      }
    }
  }
  return json;
}

function serializeArray<T>(arr: Array<T>) {
  const json: any[] = [];
  for (const obj of arr) {
    json.push(serialize(obj));
  }
  return json;
}

export default function serialize(obj: any): any {
  if (obj instanceof Set) {
    return serializeArray([...obj]);
  } else if (obj instanceof Array) {
    return serializeArray(obj);
  } else if (obj instanceof Object) {
    return serializeObject(obj);
  } else if (typeof obj === 'bigint') {
    return obj.toString();
  }
  return obj;
}
