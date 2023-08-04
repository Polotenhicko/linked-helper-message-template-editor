export const isObject = (val: any): boolean => {
  // not null
  if (!val) return false;
  // is object
  if (typeof val !== 'object' || Array.isArray(val)) return false;

  return true;
};

export const isString = (val: any): boolean => typeof val === 'string';

export const isNumber = (val: any): boolean => Number.isFinite(val);
