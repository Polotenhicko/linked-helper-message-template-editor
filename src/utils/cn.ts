import { isObject } from './validators';

type TModifiers = {
  [key: string]: boolean;
};

type TStrings = (string | undefined | null)[];

// self-written library classNames

export function cn(modifiers: TModifiers): string;
export function cn(strings: TStrings): string;
export function cn(...classNames: TStrings): string;
export function cn(...args: any[]): string {
  if (isObject(args[0])) {
    // isObject
    const classNames: TModifiers = args[0];
    return Object.entries(classNames)
      .filter((objModifier) => objModifier[1])
      .map((objModifier) => objModifier[0])
      .join(' ');
  } else if (Array.isArray(args[0])) {
    // array
    const classNames: TStrings = args[0];
    return classNames.filter((className) => className).join(' ');
  } else {
    // argument list
    const classNames: TStrings = args;
    return classNames.filter((className) => className).join(' ');
  }
}
