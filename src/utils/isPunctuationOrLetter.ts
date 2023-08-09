export function isPunctuationOrLetter(character: string) {
  const punctuationChars = ['.', ',', '!', '?', ';', ':', '(', ')', '[', ']', '{', '}', "'", '"', '-'];
  const isLetter = (character >= 'a' && character <= 'z') || (character >= 'A' && character <= 'Z');
  return punctuationChars.includes(character) || isLetter;
}
