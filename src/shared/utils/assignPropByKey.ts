export function assignPropByKey<T, K extends keyof T>(target: T, source: T, key: K) {
  target[key] = source[key]
}
