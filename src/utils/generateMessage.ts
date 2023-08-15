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
    const startMessage = getReplacedVariables(ifBlock.startMessage);

    // if exist startMessage , then IF-block is true
    if (startMessage) return true;

    // if some conditional blocks have any text in finalMessage, then true
    for (const block of ifBlock.conditionalBlocks) {
      if (block.finalMessage) return true;
    }

    // compile nested conditional blocks into string
    const stringsConditionalBlocks = getCompiledConditionalBlocks(ifBlock.conditionalBlocks);

    // if string has exist, then IF-block is true, otherwise false
    const hasConditionalResultText = !!stringsConditionalBlocks.length;

    return hasConditionalResultText;
  };

  // then and else block is similar, that`s why one method
  const getCompiledThenElseBlock = (thenElseBlock: IConditionalOperatorObj): string => {
    const startMessage = getReplacedVariables(thenElseBlock.startMessage);

    // compile nested conditional blocks to text
    const stringConditionalBlocks = getCompiledConditionalBlocks(thenElseBlock.conditionalBlocks);

    return startMessage + stringConditionalBlocks;
  };

  // compile conditional block to string
  const getCompiledConditionalBlocks = (conditionalBlocks: IConditionalBlock[]): string => {
    const result: string[] = [];

    // iterate conditionalBlock[]
    for (const block of conditionalBlocks) {
      // check IF-block
      const isTrueConditional = getCompiledIfBlock(block.if);
      // compile finalMessage
      const finalMessage = getReplacedVariables(block.finalMessage);

      // if IF-block is true, then push compiled THEN-block, otherwise ELSE-block
      if (isTrueConditional) {
        result.push(getCompiledThenElseBlock(block.then) + finalMessage);
      } else {
        result.push(getCompiledThenElseBlock(block.else) + finalMessage);
      }
    }

    // return string
    return result.join('');
  };

  // first compile startMessage and conditionalBlocks into string
  const startMessage = getReplacedVariables(template.startMessage);
  const stringConditionalBlocks = getCompiledConditionalBlocks(template.conditionalBlocks);

  return startMessage + stringConditionalBlocks;
}
