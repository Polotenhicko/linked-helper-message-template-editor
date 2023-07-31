import { useState } from 'react';
import { MessageEditor } from './components/MessageEditor';
import { Button } from './controls/Button';

export function App() {
  const [isOpenMessageEditor, setIsOpenMessageEditor] = useState(false);

  const toggleMessageEditor = () => {
    setIsOpenMessageEditor(!isOpenMessageEditor);
  };

  return (
    <>
      <Button onClick={toggleMessageEditor}>Message Editor</Button>
      {isOpenMessageEditor && <MessageEditor />}
    </>
  );
}
