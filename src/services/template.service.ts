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
      // if does not have conditional blocks, then cut out finalMessage in startMessage
      if (!this.template.conditionalBlocks.length) {
        this.template.startMessage += this.template.finalMessage;
        this.template.finalMessage = '';
      }

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
      parentOperatorObj.firstText += parentOperatorObj.secondText;
      parentOperatorObj.secondText = '';
    }

    // delete remaining nested blocks
    this.deleteNestedConditionalBlocksFromStorage(id);

    // update components
    this.notify();

    return true;
  }

  // add empty conditional block to block by blockInfo, else to first conditionalBlocks
  public addEmptyConditionalBlock(
    firstInput: HTMLTextAreaElement,
    lastFocusedInput: HTMLTextAreaElement | null
  ): boolean {
    const { template } = this;

    if (!template) return false;

    const isLastFocusedInput = !!lastFocusedInput;
    const input = isLastFocusedInput ? lastFocusedInput : firstInput;

    // get id and operator, if it is lastFocused and has this data
    const id: number | null = input.dataset.id ? Number(input.dataset.id) : null;
    const operator: string | null = input.dataset.operator ? input.dataset.operator : null;

    // firstInput and lastInput does not have id and operator
    const isAddToFirstInput = id === null || !operator;

    if (isAddToFirstInput) {
      // first conditionalBlocks have blocks or its firstInput
      // then dont need to slice startMessage
      if (template.conditionalBlocks.length || !isLastFocusedInput) {
        template.conditionalBlocks.push(this.emptyConditionalBlock);
        this.notify();
        return true;
      }

      template.conditionalBlocks.push(this.emptyConditionalBlock);

      // get cursorPosition and text after cursor
      const cursorPosition = input.selectionStart;
      const textAfterCursor = template.startMessage.slice(cursorPosition);
      // cut out text after cursor and connected them to finalMessage
      template.startMessage = template.startMessage.slice(0, cursorPosition);
      template.finalMessage = textAfterCursor;

      this.notify();

      return true;
    } else {
      // get current block by id
      const currentConditionalBlock = this.findConditionalBlock(id);
      if (!currentConditionalBlock) return false;

      for (const [key] of Object.entries(currentConditionalBlock)) {
        switch (key) {
          case 'if':
          case 'then':
          case 'else':
            if (key === operator) {
              // get operator obj by operator string
              const conditionalOperatorObj = currentConditionalBlock[key];
              // if obj has any conditional blocks, then dont need to slice firstText
              if (conditionalOperatorObj.conditionalBlocks.length) {
                conditionalOperatorObj.conditionalBlocks.push(this.emptyConditionalBlock);
                this.notify();
                return true;
              }

              conditionalOperatorObj.conditionalBlocks.push(this.emptyConditionalBlock);

              // get cursor position and text after cursor
              const cursorPosition = input.selectionStart;
              const textAfterCursor = conditionalOperatorObj.firstText.slice(cursorPosition);
              // cut out text after cursor and set it to secondText
              conditionalOperatorObj.firstText = conditionalOperatorObj.firstText.slice(0, cursorPosition);
              conditionalOperatorObj.secondText = textAfterCursor;

              this.notify();

              return true;
            }

            break;
          default:
            break;
        }
      }
    }

    return false;
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
    return { startMessage: '', finalMessage: '', conditionalBlocks: [] };
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
