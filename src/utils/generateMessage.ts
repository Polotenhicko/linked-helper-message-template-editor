import { TArrVarNames } from '../components/VarNameList/VarNameList';
import { IConditionalOperatorObj, IConditionalBlock, ITemplate } from '../services/template.service';

export interface IVarNamesObj {
  [key: string]: string;
}

export function generateMessage(template: ITemplate, values: IVarNamesObj, arrVarNames?: TArrVarNames): string {
  const getReplacedVariables = (text: string): string => {
    if (!text) return '';
    if (!arrVarNames) return text;

    for (const varName of arrVarNames) {
      const value = values[varName] ? values[varName] : '';
      text = text.split(`{${varName}}`).join(value);
    }

    return text;
  };

  const getCompiledIfBlock = (ifBlock: IConditionalOperatorObj): boolean => {
    const firstText = getReplacedVariables(ifBlock.firstText);
    const secondText = getReplacedVariables(ifBlock.secondText);

    if (firstText || secondText) return true;

    const stringsConditionalBlocks = getCompiledConditionalBlocks(ifBlock.conditionalBlocks);

    const hasConditionalResultText = !!stringsConditionalBlocks.length;

    return hasConditionalResultText;
  };

  const getCompiledThenElseBlock = (thenElseBlock: IConditionalOperatorObj): string => {
    const firstText = getReplacedVariables(thenElseBlock.firstText);
    const secondText = getReplacedVariables(thenElseBlock.secondText);

    let stringConditionalBlocks = getCompiledConditionalBlocks(thenElseBlock.conditionalBlocks);

    return firstText + stringConditionalBlocks + secondText;
  };

  const getCompiledConditionalBlocks = (conditionalBlocks: IConditionalBlock[]): string => {
    const result: string[] = [];

    for (const block of conditionalBlocks) {
      const isTrueConditional = getCompiledIfBlock(block.if);

      if (isTrueConditional) {
        result.push(getCompiledThenElseBlock(block.then));
      } else {
        result.push(getCompiledThenElseBlock(block.else));
      }
    }

    return result.filter((resultBlock) => resultBlock).join('');
  };

  const stringConditionalBlocks = getCompiledConditionalBlocks(template.conditionalBlocks);
  const startMessage = getReplacedVariables(template.startMessage);
  const finalMessage = getReplacedVariables(template.finalMessage);

  return startMessage + stringConditionalBlocks + finalMessage;
}
