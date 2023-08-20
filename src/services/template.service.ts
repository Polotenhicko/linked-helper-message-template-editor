import { LOCAL_STORAGE_TEMPLATE_KEY } from '../constants/localStorage';
import { DEFAULT_TEMPLATE } from '../constants/template';
import { getDataset } from '../utils/getDataset';
import { isNumber, isObject, isString } from '../utils/validators';
import localStorageService from './localStorage.service';
import { ObserverService } from './observer.service';

export interface IConditionalOperatorObj {
  startMessage: string;
  conditionalBlocks: IConditionalBlock[];
}

export interface IConditionalBlock {
  id: number;
  if: IConditionalOperatorObj;
  then: IConditionalOperatorObj;
  else: IConditionalOperatorObj;
  finalMessage: string;
}

export interface ITemplate {
  startMessage: string;
  conditionalBlocks: IConditionalBlock[];
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
      this.template = this.defaultTemplate;
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
      // delete current block in template
      const isSuccessDelete = this.deleteAndGluingConditionalBlocks(id, this.template);

      if (!isSuccessDelete) {
        return false;
      }

      this.notify();
      return true;
    }

    // find parent conditional block
    const parentConditionalBlock = this.findConditionalBlock(parent.id);

    if (!parentConditionalBlock) {
      console.error('Not found parent conditional block! Id:', parent.id);
      return false;
    }

    // operator must be if or then or else
    if (parent.operator !== 'if' && parent.operator !== 'then' && parent.operator !== 'else') {
      console.error('Wrong parent operator!', parent.operator);
      return false;
    }
    // get operator obj
    const parentConditionalOperatorObj = parentConditionalBlock[parent.operator];
    // delete current conditional block from operator
    const isSuccessDelete = this.deleteAndGluingConditionalBlocks(id, parentConditionalOperatorObj);

    if (!isSuccessDelete) {
      return false;
    }

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
    const isLastFocusedInputExist = document.body.contains(lastFocusedInput);
    const input = isLastFocusedInput && isLastFocusedInputExist ? lastFocusedInput : firstInput;

    const isStartMessage = !!getDataset(input, 'startMessage');
    const isFinalMessage = !!getDataset(input, 'finalMessage');

    const id: number | null = getDataset(input, 'id') ? Number(getDataset(input, 'id')) : null;
    const operator: string | null = getDataset(input, 'operator');

    if (isStartMessage) {
      if (id === null || !operator) {
        // dont have id or operator, then is template.startMessage
        this.addTextToStartMessage(input, template);

        this.notify();
        return true;
      }

      // is startMessage in conditionalOperator obj
      const currentConditionalBlock = this.findConditionalBlock(id);
      if (!currentConditionalBlock) {
        console.error('Current conditional block is not found!');
        return false;
      }
      // only if, then, else
      if (operator !== 'if' && operator !== 'then' && operator !== 'else') {
        console.error('Wrong operator!');
        return false;
      }

      const currentConditionalOperatorObj = currentConditionalBlock[operator];

      this.addTextToStartMessage(input, currentConditionalOperatorObj);

      this.notify();
      return true;
    }

    if (isFinalMessage) {
      const parentId = getDataset(input, 'parentId') ? Number(getDataset(input, 'parentId')) : null;
      const parentOperator: string | null = getDataset(input, 'parentOperator');

      if (!id) {
        console.error('Id is null!');
        return false;
      }

      if (!parentId || !parentOperator) {
        // only template.conditionalBlocks does not have parentInfo
        const currentIndex = template.conditionalBlocks.findIndex((block) => block.id === id);
        if (!~currentIndex) {
          console.error('Wrong currentIndex! Id:', id);
          return false;
        }

        this.addTextToFinalMessage(input, currentIndex, template.conditionalBlocks);

        this.notify();
        return true;
      }
      // need to find parent conditionalBlock
      // to change nested conditionalBlocks
      const parentConditionalBlock = this.findConditionalBlock(parentId);

      if (!parentConditionalBlock) {
        console.error('Not found parent conditional block!');
        return false;
      }

      if (parentOperator !== 'if' && parentOperator !== 'then' && parentOperator !== 'else') {
        console.error('Wrong parent operator!');
        return false;
      }
      // will add new conditonalBlock to conditionalOperator arr conditionalBlocks
      // by currentIndex
      const conditionalParentOperatorObj = parentConditionalBlock[parentOperator];

      const currentIndex = conditionalParentOperatorObj.conditionalBlocks.findIndex((block) => block.id === id);

      if (!~currentIndex) {
        console.error('Wrong currentIndex! Id:', id);
        return false;
      }

      this.addTextToFinalMessage(input, currentIndex, conditionalParentOperatorObj.conditionalBlocks);

      this.notify();
      return true;
    }

    return false;
  }

  // delete nested conditional blocks to free memory
  private deleteNestedConditionalBlocksFromStorage(id: number): void {
    // save reference to conditional block

    const currentConditionalBlock = this.findConditionalBlock(id);
    if (!currentConditionalBlock) {
      console.error('Not found current conditional block for nested delete. Id:', id);
      return;
    }

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

  private addTextToStartMessage(input: HTMLTextAreaElement, obj: ITemplate | IConditionalOperatorObj) {
    const dataCursorPosition = getDataset(input, 'cursorPosition');
    // if data cursorPosition is null, then do not split text
    // if 0, then split by user cursor position
    // else by value
    const cursorPosition =
      dataCursorPosition === null
        ? obj.startMessage.length
        : dataCursorPosition === '0'
        ? input.selectionStart
        : Number(dataCursorPosition);
    const textAfterCursor = obj.startMessage.slice(cursorPosition);
    // set text after cursor to finalMessage in new conditional block
    // and text before cursor to startMessage
    obj.startMessage = obj.startMessage.slice(0, cursorPosition);
    obj.conditionalBlocks.unshift(this.getEmptyConditionalBlock(textAfterCursor));
  }

  private addTextToFinalMessage(
    input: HTMLTextAreaElement,
    currentIndex: number,
    conditionalBlocks: IConditionalBlock[]
  ) {
    const dataCursorPosition = getDataset(input, 'cursorPosition');
    const condtionalBlock = conditionalBlocks[currentIndex];
    // if data cursorPosition is null, then do not split text
    // if 0, then split by user cursor position
    // else by value
    const cursorPosition =
      dataCursorPosition === null
        ? condtionalBlock.finalMessage.length
        : dataCursorPosition === '0'
        ? input.selectionStart
        : Number(dataCursorPosition);

    const textAfterCursor = condtionalBlock.finalMessage.slice(cursorPosition);
    // set finalMessage to text before cursor
    // and put empty conditional block after current index
    // with text after cursor
    condtionalBlock.finalMessage = condtionalBlock.finalMessage.slice(0, cursorPosition);
    conditionalBlocks.splice(currentIndex + 1, 0, this.getEmptyConditionalBlock(textAfterCursor));
  }

  // delete block from arr
  private deleteAndGluingConditionalBlocks(id: number, obj: IConditionalOperatorObj | ITemplate): boolean {
    const currentIndex = obj.conditionalBlocks.findIndex((block) => block.id === id);
    // check current index
    if (!~currentIndex) {
      console.error('Not found conditional block! Id:', id);
      return false;
    }

    const currentConditionalBlock = obj.conditionalBlocks[currentIndex];
    const currentFinalMessage = currentConditionalBlock.finalMessage;
    // delete current conditional block
    obj.conditionalBlocks.splice(currentIndex, 1);

    this.deleteNestedConditionalBlocksFromStorage(currentConditionalBlock.id);

    if (currentIndex === 0) {
      // that was first block
      // so need add finalMessage from current conditional block to startMessage in obj
      obj.startMessage += currentFinalMessage;
    } else {
      // get previously conditional block
      // and add finalMessage from current conditional block to finalMessage in prev block
      const prevConditionalBlock = obj.conditionalBlocks[currentIndex - 1];
      prevConditionalBlock.finalMessage += currentFinalMessage;
    }

    return true;
  }

  // find block from storage
  private findConditionalBlock(id: number): IConditionalBlock | null {
    if (!this.template) return null;

    const currentConditionalBlock = this.conditionalBlocksStorage.get(id);
    if (!currentConditionalBlock) return null;

    return currentConditionalBlock;
  }

  // validate template model
  private checkCorrectModel(template: any): boolean {
    // validate conditional operator
    const isConditionalOperatorObj = (obj: any): boolean => {
      if (!isObject(obj)) return false;

      if (!isString(obj.startMessage)) return false;

      if (!isConditionalBlocks(obj.conditionalBlocks)) return false;

      return true;
    };

    // validate array conditional block
    const isConditionalBlocks = (blocks: any): boolean => {
      if (!Array.isArray(blocks)) return false;

      for (const block of blocks) {
        if (!isNumber(block.id)) return false;

        // validate finalMessage
        if (!isString(block.finalMessage)) return false;

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

    // startMessage is string
    const { startMessage, conditionalBlocks } = template;

    if (!isString(startMessage)) return false;

    if (!isConditionalBlocks(conditionalBlocks)) return false;

    return true;
  }

  private maxConditionalId = 1;
  private conditionalBlocksStorage = new Map<number, IConditionalBlock>();

  // get empty template
  private get emptyTemplate(): ITemplate {
    return {
      startMessage: '',
      conditionalBlocks: [],
    };
  }

  // get empty conditional block with auto increment maxCondditionalId
  private getEmptyConditionalBlock(finalMessage: string): IConditionalBlock {
    const emptyBlock = {
      id: ++this.maxConditionalId,
      if: this.emptyConditionalOperatorObj,
      then: this.emptyConditionalOperatorObj,
      else: this.emptyConditionalOperatorObj,
      finalMessage: finalMessage,
    };

    // set block into storage
    this.conditionalBlocksStorage.set(emptyBlock.id, emptyBlock);

    return emptyBlock;
  }

  // get empty conditional operator
  private get emptyConditionalOperatorObj(): IConditionalOperatorObj {
    return {
      startMessage: '',
      conditionalBlocks: [],
    };
  }

  private get maxStorageConditionalId(): number {
    const ids: number[] = [];
    this.conditionalBlocksStorage.forEach((v, id) => ids.push(id));

    const max = Math.max(...ids);

    return isNumber(max) ? max : this.maxConditionalId;
  }

  private get defaultTemplate(): ITemplate {
    return DEFAULT_TEMPLATE;
  }
}

const templateService = new TemplateService();

export default templateService;
