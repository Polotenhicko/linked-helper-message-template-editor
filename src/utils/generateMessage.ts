import { TArrVarNames } from '../components/VarNameList/VarNameList';
import { IConditionalOperatorObj, IConditionalBlock, ITemplate } from '../services/template.service';

export interface IVarNamesObj {
  [key: string]: string;
}

// rendered into a separate function according to the terms of reference
// otherwise I would use it inside the service

// add argument arrVarNames to check if the name:value pair is redundant according to the terms of reference

export function generateMessage(template: ITemplate, values: IVarNamesObj, arrVarNames?: TArrVarNames): string {
  // replace variable in text into value in values
  const getReplacedVariables = (text: string): string => {
    if (!text) return '';
    if (!arrVarNames) return text;

    const regex = /{([^{}]+)}/g;

    const replacedText = text.replace(regex, (_, variable) => {
      if (arrVarNames.includes(variable)) {
        return values[variable] ?? '';
      }
      return _;
    });

    return replacedText;
  };

  // compile IF-block and nested conditional block into boolen if exist
  const getCompiledIfBlock = (ifBlock: IConditionalOperatorObj): boolean => {
    const firstText = getReplacedVariables(ifBlock.firstText);
    const secondText = getReplacedVariables(ifBlock.secondText);

    // if exist firstText or secondText, then IF-block is true
    if (firstText || secondText) return true;

    // compile nested conditional blocks into string
    const stringsConditionalBlocks = getCompiledConditionalBlocks(ifBlock.conditionalBlocks);

    // if string has exist, then IF-block is true, otherwise false
    const hasConditionalResultText = !!stringsConditionalBlocks.length;

    return hasConditionalResultText;
  };

  // then and else block is similar, that`s why one method
  const getCompiledThenElseBlock = (thenElseBlock: IConditionalOperatorObj): string => {
    const firstText = getReplacedVariables(thenElseBlock.firstText);
    const secondText = getReplacedVariables(thenElseBlock.secondText);

    // compile nested conditional blocks to text
    const stringConditionalBlocks = getCompiledConditionalBlocks(thenElseBlock.conditionalBlocks);

    return firstText + stringConditionalBlocks + secondText;
  };

  // compile conditional block to string
  const getCompiledConditionalBlocks = (conditionalBlocks: IConditionalBlock[]): string => {
    const result: string[] = [];

    // iterate conditionalBlock[]
    for (const block of conditionalBlocks) {
      // check IF-block
      const isTrueConditional = getCompiledIfBlock(block.if);

      // if IF-block is true, then push compiled THEN-block, otherwise ELSE-block
      if (isTrueConditional) {
        result.push(getCompiledThenElseBlock(block.then));
      } else {
        result.push(getCompiledThenElseBlock(block.else));
      }
    }

    // return string
    return result.join('');
  };

  // first compile startMessage, finalMessage, and conditionalBlocks into string
  const stringConditionalBlocks = getCompiledConditionalBlocks(template.conditionalBlocks);
  const startMessage = getReplacedVariables(template.startMessage);
  const finalMessage = getReplacedVariables(template.finalMessage);

  return startMessage + stringConditionalBlocks + finalMessage;
}
