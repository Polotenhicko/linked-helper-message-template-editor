import { useState } from 'react';
import { MessageEditor } from './components/MessageEditor';
import { Button } from './controls/Button';
import { TArrVarNames } from './components/VarNameList/VarNameList';
import localStorageService from './services/localStorage.service';
import varNamesService from './services/varNames.service';

export function App() {
  const arrVarNames = varNamesService.getVarNames();
  const callbackSave = () => {
    // записать шаблон в localStorage.template
  };

  const [isOpenMessageEditor, setIsOpenMessageEditor] = useState(false);

  const toggleMessageEditor = () => {
    setIsOpenMessageEditor(!isOpenMessageEditor);
  };

  const handleCloseMessageEditor = () => {
    setIsOpenMessageEditor(false);
  };

  return (
    <>
      <Button onClick={toggleMessageEditor}>Message Editor</Button>
      {isOpenMessageEditor && (
        <MessageEditor onClose={handleCloseMessageEditor} arrVarNames={arrVarNames} />
      )}
    </>
  );
}
