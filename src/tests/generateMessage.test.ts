import { TArrVarNames } from '../components/VarNameList/VarNameList';
import { ITemplate } from '../services/template.service';
import { IVarNamesObj, generateMessage } from '../utils/generateMessage';

describe('generateMessage: ', () => {
  let template: ITemplate;
  let values: IVarNamesObj;
  let arrVarNames: TArrVarNames;

  describe('test replacing variables', () => {
    it('empty text', () => {
      template = { startMessage: '', conditionalBlocks: [] };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('');
    });

    it('undefined arrVarNames', () => {
      template = { startMessage: 'Hello! Bye!', conditionalBlocks: [] };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values)).toBe('Hello! Bye!');
    });

    it('empty values', () => {
      template = { startMessage: 'Hello!\nBye!', conditionalBlocks: [] };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello!\nBye!');
    });

    it('empty pairs', () => {
      template = {
        startMessage: 'Hello {firstname}!\nBye {firstname}!',
        conditionalBlocks: [],
      };
      values = {};
      arrVarNames = ['firstname'];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello !\nBye !');
    });

    it('extra pairs', () => {
      template = {
        startMessage: 'Hello {firstname}!\nBye {firstname}!',
        conditionalBlocks: [],
      };
      values = { firstname: 'Bill' };
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello {firstname}!\nBye {firstname}!');
    });

    it('not empty firstname', () => {
      template = {
        startMessage: 'Hello {firstname}!\nBye {firstname}!',
        conditionalBlocks: [],
      };
      values = { firstname: 'Bill' };
      arrVarNames = ['firstname'];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello Bill!\nBye Bill!');
    });

    it('not empty variable and empty variable in arr', () => {
      template = {
        startMessage: 'Hello {firstname} {lastname}!\nBye {firstname} {lastname}!',
        conditionalBlocks: [],
      };
      values = { firstname: 'Bill', lastname: 'Gates' };
      arrVarNames = ['firstname'];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello Bill {lastname}!\nBye Bill {lastname}!');
    });

    it('not empty firstname and empty lastname in arr', () => {
      template = {
        startMessage: 'Hello {firstname} {lastname}!\nBye {firstname} {lastname}!',
        conditionalBlocks: [],
      };
      values = { firstname: 'Bill', lastname: 'Gates' };
      arrVarNames = ['firstname'];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello Bill {lastname}!\nBye Bill {lastname}!');
    });

    it('double not empty variable', () => {
      template = {
        startMessage: 'Hello {firstname} {lastname}!\nBye {firstname} {lastname}!',
        conditionalBlocks: [],
      };
      values = { firstname: 'Bill', lastname: 'Gates' };
      arrVarNames = ['firstname', 'lastname'];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello Bill Gates!\nBye Bill Gates!');
    });

    it('nested variable in text', () => {
      template = {
        startMessage: 'Hello {last{firstname}name}!\nBye {firstname} {lastname}!',
        conditionalBlocks: [],
      };
      values = { firstname: 'Bill', lastname: 'Gates' };
      arrVarNames = ['firstname', 'lastname'];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello {lastBillname}!\nBye Bill Gates!');
    });

    it('variable wothout brackets', () => {
      template = {
        startMessage: 'Hello firstname lastname!\nBye {firstname} {lastname}!',
        conditionalBlocks: [],
      };
      values = { firstname: 'Bill', lastname: 'Gates' };
      arrVarNames = ['firstname', 'lastname'];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello firstname lastname!\nBye Bill Gates!');
    });

    it('variable in brackets like other variable', () => {
      template = {
        startMessage: 'Hello {firstname}!\nBye {lastname}!',
        conditionalBlocks: [],
      };
      values = { firstname: '{lastname}', lastname: 'Gates' };
      arrVarNames = ['firstname', 'lastname'];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello {lastname}!\nBye Gates!');
    });
  });

  describe('test conditional: ', () => {
    it('empty conditional', () => {
      template = {
        startMessage: 'Hello!\nBye!',
        conditionalBlocks: [],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello!\nBye!');
    });

    it('true conditional', () => {
      template = {
        startMessage: 'Hello!',
        conditionalBlocks: [
          {
            id: 1,
            if: {
              startMessage: '1',
              conditionalBlocks: [],
            },
            then: {
              startMessage: 'then',
              conditionalBlocks: [],
            },
            else: {
              startMessage: 'else',
              conditionalBlocks: [],
            },
            finalMessage: 'Bye!',
          },
        ],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello!thenBye!');
    });

    it('true conditional in second text', () => {
      template = {
        startMessage: 'Hello!',
        conditionalBlocks: [
          {
            id: 1,
            finalMessage: 'Bye!',
            if: {
              startMessage: '',
              conditionalBlocks: [
                {
                  id: 2,
                  if: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  finalMessage: '1',
                },
              ],
            },
            then: {
              startMessage: 'then',
              conditionalBlocks: [],
            },
            else: {
              startMessage: 'else',
              conditionalBlocks: [],
            },
          },
        ],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello!thenBye!');
    });

    it('false conditional', () => {
      template = {
        startMessage: 'Hello!',
        conditionalBlocks: [
          {
            id: 1,
            finalMessage: 'Bye!',
            if: {
              startMessage: '',
              conditionalBlocks: [],
            },
            then: {
              startMessage: 'then',
              conditionalBlocks: [],
            },
            else: {
              startMessage: 'else',
              conditionalBlocks: [],
            },
          },
        ],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello!elseBye!');
    });

    it('true conditional with space', () => {
      template = {
        startMessage: 'Hello!',
        conditionalBlocks: [
          {
            id: 1,
            finalMessage: 'Bye!',
            if: {
              startMessage: ' ',
              conditionalBlocks: [],
            },
            then: {
              startMessage: 'then',
              conditionalBlocks: [],
            },
            else: {
              startMessage: 'else',
              conditionalBlocks: [],
            },
          },
        ],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello!thenBye!');
    });
  });

  describe('nested if', () => {
    it('nested true if', () => {
      template = {
        startMessage: 'Hello! ',
        conditionalBlocks: [
          {
            id: 1,
            finalMessage: ' Bye!',
            if: {
              startMessage: '',
              conditionalBlocks: [
                {
                  id: 2,
                  finalMessage: '',
                  if: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    startMessage: 'then',
                    conditionalBlocks: [],
                  },
                  else: {
                    startMessage: 'else',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            then: {
              startMessage: 'then',
              conditionalBlocks: [],
            },
            else: {
              startMessage: 'else',
              conditionalBlocks: [],
            },
          },
        ],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello! then Bye!');
    });

    it('parallel text in conditional block', () => {
      template = {
        startMessage: 'Hello! ',
        conditionalBlocks: [
          {
            id: 1,
            finalMessage: ' Bye!',
            if: {
              startMessage: 'true',
              conditionalBlocks: [],
            },
            then: {
              startMessage: 'then',
              conditionalBlocks: [
                {
                  id: 2,
                  finalMessage: 'final1 ',
                  if: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                },
                {
                  id: 3,
                  finalMessage: 'final2 ',
                  if: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                },
                {
                  id: 4,
                  finalMessage: 'final3 ',
                  if: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            else: {
              startMessage: 'else',
              conditionalBlocks: [],
            },
          },
        ],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello! thenfinal1 final2 final3  Bye!');
    });

    it('nested true if with startMessage', () => {
      template = {
        startMessage: 'Hello! ',
        conditionalBlocks: [
          {
            id: 1,
            finalMessage: ' Bye!',
            if: {
              startMessage: 'true',
              conditionalBlocks: [
                {
                  id: 2,
                  finalMessage: '',
                  if: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            then: {
              startMessage: 'then',
              conditionalBlocks: [],
            },
            else: {
              startMessage: 'else',
              conditionalBlocks: [],
            },
          },
        ],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello! then Bye!');
    });

    it('nested true if with secondtext', () => {
      template = {
        startMessage: 'Hello! ',
        conditionalBlocks: [
          {
            id: 1,
            finalMessage: ' Bye!',
            if: {
              startMessage: '',
              conditionalBlocks: [
                {
                  id: 2,
                  finalMessage: 'true',
                  if: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            then: {
              startMessage: 'then',
              conditionalBlocks: [],
            },
            else: {
              startMessage: 'else',
              conditionalBlocks: [],
            },
          },
        ],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello! then Bye!');
    });

    it('nested false if', () => {
      template = {
        startMessage: 'Hello! ',
        conditionalBlocks: [
          {
            id: 1,
            finalMessage: ' Bye!',
            if: {
              startMessage: '',
              conditionalBlocks: [
                {
                  id: 2,
                  finalMessage: '',
                  if: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            then: {
              startMessage: 'then',
              conditionalBlocks: [],
            },
            else: {
              startMessage: 'else',
              conditionalBlocks: [],
            },
          },
        ],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello! else Bye!');
    });

    it('deep nested true if', () => {
      template = {
        startMessage: 'Hello! ',
        conditionalBlocks: [
          {
            id: 1,
            finalMessage: ' Bye!',
            if: {
              startMessage: '',
              conditionalBlocks: [
                {
                  id: 2,
                  finalMessage: '',
                  if: {
                    startMessage: '',
                    conditionalBlocks: [
                      {
                        id: 3,
                        finalMessage: '',
                        if: {
                          startMessage: '2',
                          conditionalBlocks: [],
                        },
                        then: {
                          startMessage: 'then2',
                          conditionalBlocks: [],
                        },
                        else: {
                          startMessage: 'else2',
                          conditionalBlocks: [],
                        },
                      },
                    ],
                  },
                  then: {
                    startMessage: 'then1',
                    conditionalBlocks: [],
                  },
                  else: {
                    startMessage: 'else1',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            then: {
              startMessage: 'then',
              conditionalBlocks: [],
            },
            else: {
              startMessage: 'else',
              conditionalBlocks: [],
            },
          },
        ],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello! then Bye!');
    });

    it('deep nested false if', () => {
      template = {
        startMessage: 'Hello! ',
        conditionalBlocks: [
          {
            id: 1,
            finalMessage: ' Bye!',
            if: {
              startMessage: '',
              conditionalBlocks: [
                {
                  id: 2,
                  finalMessage: '',
                  if: {
                    startMessage: '',
                    conditionalBlocks: [
                      {
                        id: 3,
                        finalMessage: '',
                        if: {
                          startMessage: '2',
                          conditionalBlocks: [],
                        },
                        then: {
                          startMessage: '',
                          conditionalBlocks: [],
                        },
                        else: {
                          startMessage: 'else2',
                          conditionalBlocks: [],
                        },
                      },
                    ],
                  },
                  then: {
                    startMessage: 'then1',
                    conditionalBlocks: [],
                  },
                  else: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            then: {
              startMessage: 'then',
              conditionalBlocks: [],
            },
            else: {
              startMessage: 'else',
              conditionalBlocks: [],
            },
          },
        ],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello! else Bye!');
    });
  });

  describe('nested then', () => {
    it('nested true conditional then', () => {
      template = {
        startMessage: 'Hello!',
        conditionalBlocks: [
          {
            id: 1,
            finalMessage: 'Bye!',
            if: {
              startMessage: '1',
              conditionalBlocks: [],
            },
            then: {
              startMessage: ' then',
              conditionalBlocks: [
                {
                  id: 2,
                  finalMessage: ', then continue ',
                  if: {
                    startMessage: '1',
                    conditionalBlocks: [],
                  },
                  then: {
                    startMessage: ', nested then',
                    conditionalBlocks: [],
                  },
                  else: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            else: {
              startMessage: '',
              conditionalBlocks: [],
            },
          },
        ],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello! then, nested then, then continue Bye!');
    });

    it('nested false conditional then', () => {
      template = {
        startMessage: 'Hello!',
        conditionalBlocks: [
          {
            id: 1,
            finalMessage: 'Bye!',
            if: {
              startMessage: '1',
              conditionalBlocks: [],
            },
            then: {
              startMessage: ' then',
              conditionalBlocks: [
                {
                  id: 2,
                  finalMessage: ', then continue ',
                  if: {
                    startMessage: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    startMessage: ', nested then',
                    conditionalBlocks: [],
                  },
                  else: {
                    startMessage: ', nested else',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            else: {
              startMessage: '',
              conditionalBlocks: [],
            },
          },
        ],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello! then, nested else, then continue Bye!');
    });
  });

  describe('nested else', () => {
    it('nested true conditional else', () => {
      template = {
        startMessage: 'Hello!',
        conditionalBlocks: [
          {
            id: 1,
            finalMessage: 'Bye!',
            if: {
              startMessage: '',
              conditionalBlocks: [],
            },
            then: {
              startMessage: ' then',
              conditionalBlocks: [],
            },
            else: {
              startMessage: ' else',
              conditionalBlocks: [
                {
                  id: 2,
                  finalMessage: ', else continue ',
                  if: {
                    startMessage: '1',
                    conditionalBlocks: [],
                  },
                  then: {
                    startMessage: ', nested then',
                    conditionalBlocks: [],
                  },
                  else: {
                    startMessage: ', nested else',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
          },
        ],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello! else, nested then, else continue Bye!');
    });

    it('nested false conditional else', () => {
      template = {
        startMessage: 'Hello!',
        conditionalBlocks: [
          {
            id: 1,
            finalMessage: 'Bye!',
            if: {
              startMessage: '',
              conditionalBlocks: [],
            },
            then: {
              startMessage: ' then',
              conditionalBlocks: [],
            },
            else: {
              startMessage: ' else',
              conditionalBlocks: [
                {
                  id: 2,
                  finalMessage: ', else continue ',
                  if: {
                    startMessage: '1',
                    conditionalBlocks: [],
                  },
                  then: {
                    startMessage: ', nested then',
                    conditionalBlocks: [],
                  },
                  else: {
                    startMessage: ', nested else',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
          },
        ],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello! else, nested then, else continue Bye!');
    });
  });
});
