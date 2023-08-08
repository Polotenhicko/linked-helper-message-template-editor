import { useState } from 'react';
import { MessageEditor } from './components/MessageEditor';
import { Button } from './controls/Button';
import localStorageService from './services/localStorage.service';
import varNamesService from './services/varNames.service';
import templateService from './services/template.service';
import { MessagePreview } from './components/MessagePreview';

export type TCallbackSave = () => Promise<void>;

export function App() {
  const arrVarNames = varNamesService.getVarNames();
  const callbackSave = async () => {
    templateService.saveTemplate();
  };

  const [isOpenMessageEditor, setIsOpenMessageEditor] = useState(false);
  const [isOpenMessagePreview, setIsOpenMessagePreview] = useState(false);

  const template = templateService.getTemplate();

  const openMessageEditor = () => {
    setIsOpenMessageEditor(true);
  };

  const closeMessageEditor = () => {
    setIsOpenMessageEditor(false);
  };

  const openMessagePreview = () => {
    setIsOpenMessagePreview(true);
  };

  const closeMessagePreview = () => {
    setIsOpenMessagePreview(false);
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
          onShowMessagePreview={openMessagePreview}
        />
      )}
      {isOpenMessagePreview && (
        <MessagePreview arrVarNames={arrVarNames} template={template} onClose={closeMessagePreview} />
      )}
    </>
  );
}
