import { LOCAL_STORAGE_ARR_VAR_NAMES_KEY } from '../constants/localStorage';
import { isString } from '../utils/validators';
import localStorageService from './localStorage.service';

type TVarNames = string[];

// service for arrVarNames

class VarNamesService {
  // get arrVarNames from localStorage
  public getVarNames(): TVarNames {
    const varNames = localStorageService.getItem(LOCAL_STORAGE_ARR_VAR_NAMES_KEY);

    // check is correct model
    const isCorrectModel = this.checkCorrectModel(varNames);

    if (!isCorrectModel) {
      console.error('Incorrect varnames model!', varNames);
      // is correct model, and set base model into localstorage
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

    // check if there are no strings
    const incorrectVarName = varNames.some((varName) => !isString(varName));
    if (incorrectVarName) return false;

    return true;
  }

  private get baseVarNames(): TVarNames {
    return ['firstname', 'lastname', 'company', 'position'];
  }
}

const varNamesService = new VarNamesService();

export default varNamesService;
