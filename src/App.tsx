import { useState } from 'react';
import { MessageEditor } from './components/MessageEditor';
import { Button } from './controls/Button';
import varNamesService from './services/varNames.service';
import templateService from './services/template.service';

export type TCallbackSave = () => Promise<void>;

export function App() {
  const callbackSave = async () => {
    templateService.saveTemplate();
  };

  const [isOpenMessageEditor, setIsOpenMessageEditor] = useState(false);

  const template = templateService.getTemplate();
  const arrVarNames = varNamesService.getVarNames();

  const openMessageEditor = () => {
    setIsOpenMessageEditor(true);
  };

  const closeMessageEditor = () => {
    setIsOpenMessageEditor(false);
  };

  return (
    <>
      <Button onClick={openMessageEditor}>Message Editor</Button>
      {isOpenMessageEditor && (
        <MessageEditor
          onClose={closeMessageEditor}
          arrVarNames={arrVarNames}
          template={template}
          callbackSave={callbackSave}
        />
      )}
    </>
  );
}
