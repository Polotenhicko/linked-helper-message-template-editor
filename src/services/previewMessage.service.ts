import { TArrVarNames } from '../components/VarNameList/VarNameList';
import { ObserverService } from './observer.service';
import templateService, { IConditionalBlock, IConditionalOperatorObj, ITemplate } from './template.service';

interface IVarNamesObj {
  [key: string]: string;
}

class PreviewMessage extends ObserverService {
  public getMessage(): string {
    if (!this.template) return '';

    console.log(this.template);

    const message = this.generateMessage(this.template, this.varNames);

    if (message === this.lastMessage) return message;

    this.lastMessage = message;

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

  private lastMessage: string = '';
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

      return result.filter((resultBlock) => resultBlock).join('\n');
    };

    const stringConditionalBlocks = getCompiledConditionalBlocks(template.conditionalBlocks);
    const startMessage = this.getReplacedVariables(template.startMessage, values);
    const finalMessage = this.getReplacedVariables(template.finalMessage, values);

    return startMessage + '\n' + stringConditionalBlocks + '\n' + finalMessage;
  }
}

export default new PreviewMessage();
