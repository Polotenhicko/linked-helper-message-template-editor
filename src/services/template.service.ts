import { LOCAL_STORAGE_TEMPLATE_KEY } from '../constants/localStorage';
import localStorageService from './localStorage.service';

interface IConditionanBlock {
  if: string;
  then: string;
  else: string;
  internalConditional?: IConditionanBlock;
}

interface ITemplate {
  startMessage: string;
  conditionalBlock?: IConditionanBlock;
  finalMessage: string;
}

class TemplateService {
  public template: ITemplate | null = null;

  public getTemplate(): ITemplate {
    if (this.template) return this.template;

    const template = localStorageService.getItem(LOCAL_STORAGE_TEMPLATE_KEY);

    const isCorrectModel = this.checkCorrectModel(template);

    if (!isCorrectModel) {
      this.setTemplate(this.emptyTemplate);
      this.template = this.emptyTemplate;
      return this.emptyTemplate;
    }

    this.template = template;

    return template;
  }

  // public addEmptyConditionalBlock() {
  //   if (!this.template.conditionalBlock) {

  //   }

  // }

  public setTemplate(template: ITemplate): boolean {
    const isSuccessSet = localStorageService.setItem(LOCAL_STORAGE_TEMPLATE_KEY, template);
    if (!isSuccessSet) return false;
    this.template = template;
    return true;
  }

  private checkCorrectModel(template: any): boolean {
    const isObject = (val: any): boolean => {
      // not null
      if (!val) return false;
      // is object
      if (typeof val !== 'object' || Array.isArray(val)) return false;

      return true;
    };

    const isString = (val: any): boolean => typeof val === 'string';

    const isConditionalBlock = (val: any): boolean => {
      if (!isObject(val)) return false;

      for (const [key, value] of Object.entries(val)) {
        switch (key) {
          case 'if':
          case 'then':
          case 'else':
            if (!isString(value)) return false;
            break;
          case 'internalConditional':
            const isCorrectModel = isConditionalBlock(value);
            if (!isCorrectModel) return false;
            break;
        }
      }

      return true;
    };

    // template is object
    if (!isObject(template)) return false;

    // startMessage & finalMessage is string
    const { startMessage, finalMessage } = template;
    if (!isString(startMessage) || !isString(finalMessage)) return false;

    const { conditionalBlock } = template;
    if (conditionalBlock) {
      // check that the conditional block is correct
      if (!isConditionalBlock(conditionalBlock)) return false;
    }

    return true;
  }

  private emptyTemplate: ITemplate = { startMessage: '', finalMessage: '' };
  private emptyConditionalBlock: IConditionanBlock = { if: '', then: '', else: '' };
}

export default new TemplateService();
