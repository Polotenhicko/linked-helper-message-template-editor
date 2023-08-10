import { LOCAL_STORAGE_ARR_VAR_NAMES_KEY } from '../constants/localStorage';
import { isString } from '../utils/validators';
import localStorageService from './localStorage.service';

type TVarNames = string[];

class VarNamesService {
  public getVarNames(): TVarNames {
    const varNames = localStorageService.getItem(LOCAL_STORAGE_ARR_VAR_NAMES_KEY);

    const isCorrectModel = this.checkCorrectModel(varNames);

    if (!isCorrectModel) {
      console.error('Incorrect varnames model!', varNames);
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

    const incorrectVarName = varNames.some((varName) => !isString(varName));
    if (incorrectVarName) return false;

    return true;
  }

  private baseVarNames: TVarNames = ['firstname', 'lastname', 'company', 'position'];
}

const varNamesService = new VarNamesService();

export default varNamesService;
