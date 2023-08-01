type TModifiers = {
  [key: string]: boolean;
};

type TStrings = string[];

export function cn(modifiers: TModifiers): string;
export function cn(strings: TStrings): string;
export function cn(...classNames: TStrings): string;
export function cn(...args: any[]): string {
  if (typeof args[0] === 'object' && !Array.isArray(args[0])) {
    // объект
    const classNames: TModifiers = args[0];
    return Object.entries(classNames)
      .filter((objModifier) => objModifier[1])
      .map((objModifier) => objModifier[0])
      .join(' ');
  } else if (Array.isArray(args[0])) {
    // массив
    const classNames: TStrings = args[0];
    return classNames.filter((className) => className).join(' ');
  } else {
    // список аргументов
    const classNames: TStrings = args;
    return classNames.filter((className) => className).join(' ');
  }
}
