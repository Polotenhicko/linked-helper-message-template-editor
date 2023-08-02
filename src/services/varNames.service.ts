import { LOCAL_STORAGE_ARR_VAR_NAMES_KEY } from '../constants/localStorage';
import localStorageService from './localStorage.service';

type TVarNames = string[];

class VarNamesService {
  public getVarNames(): TVarNames {
    const varNames = localStorageService.getItem(LOCAL_STORAGE_ARR_VAR_NAMES_KEY);

    const isCorrectModel = this.checkCorrectModel(varNames);

    if (!isCorrectModel) {
      this.setBaseVarNames();
      return this.baseVarNames;
    }

    return varNames;
  }

  public setBaseVarNames(): boolean {
    return localStorageService.setItem(LOCAL_STORAGE_ARR_VAR_NAMES_KEY, this.baseVarNames);
  }

  private checkCorrectModel(varNames: any): boolean {
    if (!Array.isArray(varNames)) return false;

    const incorrectVarName = varNames.some((varName) => typeof varName !== 'string');
    if (incorrectVarName) return false;

    return true;
  }

  private baseVarNames: TVarNames = ['firstname', 'lastname', 'company', 'position'];
}

export default new VarNamesService();
