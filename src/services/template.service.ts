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

// service for appeals template

class TemplateService extends ObserverService {
  public template: ITemplate | null = null;

  // get template from localstorage, otherwise from emptyTemplate
  public getTemplate(): ITemplate {
    if (this.template) return this.template;

    const template = localStorageService.getItem(LOCAL_STORAGE_TEMPLATE_KEY);

    const isCorrectModel = this.checkCorrectModel(template);

    if (!isCorrectModel) {
      console.error('Incorrect template model!', template);

      // clear storage, since after checking the model, the storage is clogged
      this.conditionalBlocksStorage.clear();
      this.template = this.emptyTemplate;
      this.saveTemplate();

      return this.emptyTemplate;
    }

    this.template = template;

    // get max conditionalId after validate model
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

  // delete conditionalBlock
  // if parent exist, then find operator obj in parent block, and delete current conditional block
  // else delete block in first conditionalBlock
  public deleteConditionalBlock(id: number, parent?: { id: number; operator: 'if' | 'then' | 'else' }): boolean {
    if (!this.template) return false;

    if (!parent) {
      // delete block from first conditional blocks
      const isSuccessDelete = this.deleteConditionalBlockFromArr(id, this.template.conditionalBlocks);
      // update components
      this.notify();

      return isSuccessDelete;
    }

    // looking for parent block
    const parentConditionalBlock = this.findConditionalBlock(parent.id);
    if (!parentConditionalBlock) return false;

    // looking for operator obj
    const parentOperatorObj = parentConditionalBlock[parent.operator];
    // if he is empty, then return false
    if (!parentOperatorObj.conditionalBlocks.length) return false;
    // delete conditionalBlock from arr
    const isSuccessDelete = this.deleteConditionalBlockFromArr(id, parentOperatorObj.conditionalBlocks);
    if (!isSuccessDelete) return false;

    // if operator does not have any block and secondText is not empty
    if (!parentOperatorObj.conditionalBlocks.length && parentOperatorObj.secondText) {
      // glue secondText for firstText and clear secondText
      parentOperatorObj.firstText += '\n' + parentOperatorObj.secondText;
      parentOperatorObj.secondText = '';
    }

    // delete remaining nested blocks
    this.deleteNestedConditionalBlocksFromStorage(id);

    // update components
    this.notify();

    return true;
  }

  // add empty conditional block to block by blockInfo, else to first conditionalBlocks
  public addEmptyConditionalBlock(blockInfo?: { id: number; operator: 'if' | 'then' | 'else' }): boolean {
    const { template } = this;

    if (!template) return false;

    if (!blockInfo) {
      // add empty conditional block to first arr conditonalBlocks
      template.conditionalBlocks.push(this.emptyConditionalBlock);
      // update components
      this.notify();

      return true;
    }

    const { id, operator } = blockInfo;

    // find current conditionalBlock
    const currentConditionalBlock = this.findConditionalBlock(id);

    if (!currentConditionalBlock) return false;

    // get operator
    const conditionalOperatorObj = currentConditionalBlock[operator];

    // push empty conditional block
    conditionalOperatorObj.conditionalBlocks.push(this.emptyConditionalBlock);
    // update components
    this.notify();

    return true;
  }

  // delete nested conditional blocks to free memory
  private deleteNestedConditionalBlocksFromStorage(id: number): void {
    // save reference to conditional block
    const currentConditionalBlock = this.findConditionalBlock(id);
    if (!currentConditionalBlock) return;

    // delete this block
    this.conditionalBlocksStorage.delete(id);

    // find all nested conditional blocks and recursively remove them
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

  // delete block from arr
  private deleteConditionalBlockFromArr(id: number, parentArr: IConditionalBlock[]): boolean {
    const currentIndex = parentArr.findIndex((block) => block.id === id);

    if (~currentIndex) {
      parentArr.splice(currentIndex, 1);
      return true;
    }

    return false;
  }

  // find block from storage
  private findConditionalBlock(id: number): IConditionalBlock | null {
    if (!this.template || !this.template.conditionalBlocks.length) return null;

    const currentConditionalBlock = this.conditionalBlocksStorage.get(id);
    if (!currentConditionalBlock) return null;

    return currentConditionalBlock;
  }

  // validate template model
  private checkCorrectModel(template: any): boolean {
    // validate conditional operator
    const isConditionalOperatorObj = (obj: any): boolean => {
      if (!isObject(obj)) return false;

      if (!isString(obj.firstText)) return false;
      if (!isString(obj.secondText)) return false;

      const { conditionalBlocks } = obj;

      if (!isConditionalBlocks(conditionalBlocks)) return false;

      return true;
    };

    // validate array conditional block
    const isConditionalBlocks = (blocks: any): boolean => {
      if (!Array.isArray(blocks)) return false;

      for (const block of blocks) {
        if (!isNumber(block.id)) return false;

        // validate all operators
        if (!isConditionalOperatorObj(block.if)) return false;
        if (!isConditionalOperatorObj(block.then)) return false;
        if (!isConditionalOperatorObj(block.else)) return false;

        // if id is repeated, then is uncorrect model
        if (this.conditionalBlocksStorage.has(block.id)) return false;
        // set block in storage
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

  // get empty template
  private get emptyTemplate(): ITemplate {
    return { startMessage: '', finalMessage: '', conditionalBlocks: [this.emptyConditionalBlock] };
  }

  // get empty conditional block with auto increment maxCondditionalId
  private get emptyConditionalBlock(): IConditionalBlock {
    const emptyBlock = {
      id: ++this.maxConditionalId,
      if: this.emptyConditionalOperatorObj,
      then: this.emptyConditionalOperatorObj,
      else: this.emptyConditionalOperatorObj,
    };

    // set block into storage
    this.conditionalBlocksStorage.set(emptyBlock.id, emptyBlock);

    return emptyBlock;
  }

  // get empty conditional operator
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
