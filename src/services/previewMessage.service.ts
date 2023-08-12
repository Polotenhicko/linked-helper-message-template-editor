import { TArrVarNames } from '../components/VarNameList/VarNameList';
import { ObserverService } from './observer.service';
import { IConditionalBlock, IConditionalOperatorObj, ITemplate } from './template.service';

interface IVarNamesObj {
  [key: string]: string;
}

class PreviewMessageService extends ObserverService {
  public getMessage(): string {
    if (!this.template) return '';

    const message = this.generateMessage(this.template, this.varNames);

    return message;
  }

  public setVarNames(varName: string, value: string): void {
    if (!(varName in this.varNames)) return;

    this.varNames[varName] = value;
  }

  public setVariables(varNames: TArrVarNames, template: ITemplate): void {
    const tuplesVarName = varNames.map((varName) => [varName, '']);

    this.varNames = Object.fromEntries(tuplesVarName);

    this.template = template;
  }

  private varNames: IVarNamesObj = {};
  private template: ITemplate | null = null;

  private getReplacedVariables(text: string, values: IVarNamesObj): string {
    if (!text) return '';

    for (const [variable, value] of Object.entries(values)) {
      text = text.split(`{${variable}}`).join(value);
    }

    return text;
  }

  private generateMessage(template: ITemplate, values: IVarNamesObj): string {
    const getCompiledIfBlock = (ifBlock: IConditionalOperatorObj): boolean => {
      const firstText = this.getReplacedVariables(ifBlock.firstText, values);
      const secondText = this.getReplacedVariables(ifBlock.secondText, values);

      if (firstText || secondText) return true;

      const stringsConditionalBlocks = getCompiledConditionalBlocks(ifBlock.conditionalBlocks);

      const hasConditionalResultText = !!stringsConditionalBlocks.length;

      return hasConditionalResultText;
    };

    const getCompiledThenElseBlock = (thenElseBlock: IConditionalOperatorObj): string => {
      const firstText = this.getReplacedVariables(thenElseBlock.firstText, values);
      const secondText = this.getReplacedVariables(thenElseBlock.secondText, values);

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
    const startMessage = this.getReplacedVariables(template.startMessage, values);
    const finalMessage = this.getReplacedVariables(template.finalMessage, values);

    return startMessage + stringConditionalBlocks + finalMessage;
  }
}

const previewMessageService = new PreviewMessageService();

export default previewMessageService;

function generateMessage(template: ITemplate, values: IVarNamesObj, arrVarNames: TArrVarNames): string {
  const getReplacedVariables = (text: string): string => {
    if (!text) return '';

    for (const [variable, value] of Object.entries(values)) {
      if (arrVarNames.includes(variable)) {
        text = text.split(`{${variable}}`).join(value);
      }
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
