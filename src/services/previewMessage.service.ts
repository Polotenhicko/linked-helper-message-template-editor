import { TArrVarNames } from '../components/VarNameList/VarNameList';
import { generateMessage } from '../utils/generateMessage';
import { ITemplate } from './template.service';

export interface IValueInfo {
  name: string;
  value: string;
}

class PreviewMessageService {
  public getMessage(valueInfo?: IValueInfo): string {
    if (!this.template) return '';

    if (valueInfo) {
      this.valuesStorage.set(valueInfo.name, valueInfo.value);
    }

    const values = Object.fromEntries(this.valuesStorage.entries());

    return generateMessage(this.template, values, this.arrVarNames);
  }

  public setVariables(template: ITemplate, arrVarNames: TArrVarNames) {
    this.template = template;
    this.arrVarNames = arrVarNames;
  }

  public clearVariables(): void {
    this.valuesStorage.clear();
    this.template = null;
  }

  private valuesStorage = new Map<string, string>();
  private template: ITemplate | null = null;
  private arrVarNames: TArrVarNames = [];
}

const previewMessageService = new PreviewMessageService();

export default previewMessageService;
