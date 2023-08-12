import { LOCAL_STORAGE_TEMPLATE_KEY } from '../constants/localStorage';
import { isNumber, isObject, isString } from '../utils/validators';
import localStorageService from './localStorage.service';
import { ObserverService } from './observer.service';

export interface IConditionalOperatorObj {
  firstText: string;
  secondText: string;
  conditionalBlocks: IConditionalBlock[];
}

export interface IConditionalBlock {
  id: number;
  if: IConditionalOperatorObj;
  then: IConditionalOperatorObj;
  else: IConditionalOperatorObj;
}

export interface ITemplate {
  startMessage: string;
  conditionalBlocks: IConditionalBlock[];
  finalMessage: string;
}

class TemplateService extends ObserverService {
  public template: ITemplate | null = null;

  public getTemplate(): ITemplate {
    if (this.template) return this.template;

    const template = localStorageService.getItem(LOCAL_STORAGE_TEMPLATE_KEY);

    const isCorrectModel = this.checkCorrectModel(template);

    if (!isCorrectModel) {
      console.error('Incorrect template model!', template);

      this.conditionalBlocksStorage.clear();
      this.template = this.emptyTemplate;
      this.saveTemplate();

      return this.emptyTemplate;
    }

    this.template = template;

    this.maxConditionalId = this.maxStorageConditionalId;

    return template;
  }

  public saveTemplate(): boolean {
    if (!this.template) return false;

    const isSuccessSave = localStorageService.setItem(LOCAL_STORAGE_TEMPLATE_KEY, this.template);

    return isSuccessSave;
  }

  public clearTemplate(): void {
    this.template = null;
    this.conditionalBlocksStorage.clear();
    this.maxConditionalId = 1;
  }

  public deleteConditionalBlock(id: number, parent?: { id: number; operator: 'if' | 'then' | 'else' }): boolean {
    if (!this.template) return false;

    if (!parent) {
      const isSuccessDelete = this.deleteConditionalBlockFromArr(id, this.template.conditionalBlocks);
      this.notify();

      return isSuccessDelete;
    }

    const parentConditionalBlock = this.findConditionalBlock(parent.id);
    if (!parentConditionalBlock) return false;

    const parentOperatorObj = parentConditionalBlock[parent.operator];

    if (!parentOperatorObj.conditionalBlocks.length) return false;

    const isSuccessDelete = this.deleteConditionalBlockFromArr(id, parentOperatorObj.conditionalBlocks);
    if (!isSuccessDelete) return false;

    if (!parentOperatorObj.conditionalBlocks.length && parentOperatorObj.secondText) {
      parentOperatorObj.firstText += '\n' + parentOperatorObj.secondText;
      parentOperatorObj.secondText = '';
    }

    this.deleteNestedConditionalBlocksFromStorage(id);

    this.notify();

    return true;
  }

  public addEmptyConditionalBlock(blockInfo?: { id: number; operator: 'if' | 'then' | 'else' }): boolean {
    const { template } = this;

    if (!template) return false;

    if (!blockInfo) {
      template.conditionalBlocks.push(this.emptyConditionalBlock);
      this.notify();

      return true;
    }

    const { id, operator } = blockInfo;

    const currentConditionalBlock = this.findConditionalBlock(id);
    console.log(currentConditionalBlock);

    if (!currentConditionalBlock) return false;

    const conditionalOperatorObj = currentConditionalBlock[operator];

    conditionalOperatorObj.conditionalBlocks.push(this.emptyConditionalBlock);

    this.notify();

    return true;
  }

  private deleteNestedConditionalBlocksFromStorage(id: number): void {
    const currentConditionalBlock = this.findConditionalBlock(id);
    if (!currentConditionalBlock) return;

    this.conditionalBlocksStorage.delete(id);

    for (const [operator, operatorObj] of Object.entries(currentConditionalBlock)) {
      switch (operator) {
        case 'if':
        case 'then':
        case 'else':
          const { conditionalBlocks } = operatorObj as IConditionalOperatorObj;

          for (const block of conditionalBlocks) {
            this.deleteNestedConditionalBlocksFromStorage(block.id);
          }

          break;
        default:
          break;
      }
    }
  }

  private deleteConditionalBlockFromArr(id: number, parentArr: IConditionalBlock[]): boolean {
    const currentIndex = parentArr.findIndex((block) => block.id === id);

    if (~currentIndex) {
      parentArr.splice(currentIndex, 1);
      return true;
    }

    return false;
  }

  private findConditionalBlock(id: number): IConditionalBlock | null {
    if (!this.template || !this.template.conditionalBlocks.length) return null;

    const currentConditionalBlock = this.conditionalBlocksStorage.get(id);
    if (!currentConditionalBlock) return null;

    return currentConditionalBlock;
  }

  private checkCorrectModel(template: any): boolean {
    const isConditionalOperatorObj = (obj: any): boolean => {
      if (!isObject(obj)) return false;

      if (!isString(obj.firstText)) return false;
      if (!isString(obj.secondText)) return false;

      const { conditionalBlocks } = obj;

      if (!isConditionalBlocks(conditionalBlocks)) return false;

      return true;
    };

    const isConditionalBlocks = (blocks: any): boolean => {
      if (!Array.isArray(blocks)) return false;

      for (const block of blocks) {
        if (!isNumber(block.id)) return false;

        if (!isConditionalOperatorObj(block.if)) return false;
        if (!isConditionalOperatorObj(block.then)) return false;
        if (!isConditionalOperatorObj(block.else)) return false;

        if (this.conditionalBlocksStorage.has(block.id)) return false;

        this.conditionalBlocksStorage.set(block.id, block);
      }

      return true;
    };

    // template is object
    if (!isObject(template)) return false;

    // startMessage & finalMessage is string
    const { startMessage, finalMessage } = template;
    if (!isString(startMessage) || !isString(finalMessage)) return false;

    const { conditionalBlocks } = template;

    if (!isConditionalBlocks(conditionalBlocks)) return false;

    return true;
  }

  private maxConditionalId = 1;
  private conditionalBlocksStorage = new Map<number, IConditionalBlock>();

  private get emptyTemplate(): ITemplate {
    return { startMessage: '', finalMessage: '', conditionalBlocks: [this.emptyConditionalBlock] };
  }

  private get emptyConditionalBlock(): IConditionalBlock {
    const emptyBlock = {
      id: ++this.maxConditionalId,
      if: this.emptyConditionalOperatorObj,
      then: this.emptyConditionalOperatorObj,
      else: this.emptyConditionalOperatorObj,
    };

    this.conditionalBlocksStorage.set(emptyBlock.id, emptyBlock);

    return emptyBlock;
  }

  private get emptyConditionalOperatorObj(): IConditionalOperatorObj {
    return { firstText: '', secondText: '', conditionalBlocks: [] };
  }

  private get maxStorageConditionalId(): number {
    const ids: number[] = [];
    this.conditionalBlocksStorage.forEach((v, id) => ids.push(id));

    const max = Math.max(...ids);

    return isNumber(max) ? max : this.maxConditionalId;
  }
}

const templateService = new TemplateService();

export default templateService;
