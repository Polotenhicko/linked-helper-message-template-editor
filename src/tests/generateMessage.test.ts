import { TArrVarNames } from '../components/VarNameList/VarNameList';
import { ITemplate } from '../services/template.service';
import { IVarNamesObj, generateMessage } from '../utils/generateMessage';

describe('generateMessage: ', () => {
  let template: ITemplate;
  let values: IVarNamesObj;
  let arrVarNames: TArrVarNames;

  describe('test replacing variables', () => {
    it('empty text', () => {
      template = { startMessage: '', finalMessage: '', conditionalBlocks: [] };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('');
    });

    it('undefined arrVarNames', () => {
      template = { startMessage: 'Hello!', finalMessage: ' Bye!', conditionalBlocks: [] };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values)).toBe('Hello! Bye!');
    });

    it('empty values', () => {
      template = { startMessage: 'Hello!\n', finalMessage: 'Bye!', conditionalBlocks: [] };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello!\nBye!');
    });

    it('empty pairs', () => {
      template = {
        startMessage: 'Hello {firstname}!\n',
        finalMessage: 'Bye {firstname}!',
        conditionalBlocks: [],
      };
      values = {};
      arrVarNames = ['firstname'];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello !\nBye !');
    });

    it('extra pairs', () => {
      template = {
        startMessage: 'Hello {firstname}!\n',
        finalMessage: 'Bye {firstname}!',
        conditionalBlocks: [],
      };
      values = { firstname: 'Bill' };
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello {firstname}!\nBye {firstname}!');
    });

    it('not empty firstname', () => {
      template = {
        startMessage: 'Hello {firstname}!\n',
        finalMessage: 'Bye {firstname}!',
        conditionalBlocks: [],
      };
      values = { firstname: 'Bill' };
      arrVarNames = ['firstname'];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello Bill!\nBye Bill!');
    });

    it('not empty variable and empty variable in arr', () => {
      template = {
        startMessage: 'Hello {firstname} {lastname}!\n',
        finalMessage: 'Bye {firstname} {lastname}!',
        conditionalBlocks: [],
      };
      values = { firstname: 'Bill', lastname: 'Gates' };
      arrVarNames = ['firstname'];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello Bill {lastname}!\nBye Bill {lastname}!');
    });

    it('not empty firstname and empty lastname in arr', () => {
      template = {
        startMessage: 'Hello {firstname} {lastname}!\n',
        finalMessage: 'Bye {firstname} {lastname}!',
        conditionalBlocks: [],
      };
      values = { firstname: 'Bill', lastname: 'Gates' };
      arrVarNames = ['firstname'];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello Bill {lastname}!\nBye Bill {lastname}!');
    });

    it('double not empty variable', () => {
      template = {
        startMessage: 'Hello {firstname} {lastname}!\n',
        finalMessage: 'Bye {firstname} {lastname}!',
        conditionalBlocks: [],
      };
      values = { firstname: 'Bill', lastname: 'Gates' };
      arrVarNames = ['firstname', 'lastname'];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello Bill Gates!\nBye Bill Gates!');
    });

    it('nested variable in text', () => {
      template = {
        startMessage: 'Hello {last{firstname}name}!\n',
        finalMessage: 'Bye {firstname} {lastname}!',
        conditionalBlocks: [],
      };
      values = { firstname: 'Bill', lastname: 'Gates' };
      arrVarNames = ['firstname', 'lastname'];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello {lastBillname}!\nBye Bill Gates!');
    });

    it('variable wothout brackets', () => {
      template = {
        startMessage: 'Hello firstname lastname!\n',
        finalMessage: 'Bye {firstname} {lastname}!',
        conditionalBlocks: [],
      };
      values = { firstname: 'Bill', lastname: 'Gates' };
      arrVarNames = ['firstname', 'lastname'];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello firstname lastname!\nBye Bill Gates!');
    });

    it('variable in brackets like other variable', () => {
      template = {
        startMessage: 'Hello {firstname}!\n',
        finalMessage: 'Bye {lastname}!',
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
        startMessage: 'Hello!\n',
        finalMessage: 'Bye!',
        conditionalBlocks: [],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello!\nBye!');
    });

    it('true conditional', () => {
      template = {
        startMessage: 'Hello!',
        finalMessage: 'Bye!',
        conditionalBlocks: [
          {
            id: 1,
            if: {
              firstText: '1',
              secondText: '',
              conditionalBlocks: [],
            },
            then: {
              firstText: 'then',
              secondText: '',
              conditionalBlocks: [],
            },
            else: {
              firstText: 'else',
              secondText: '',
              conditionalBlocks: [],
            },
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
        finalMessage: 'Bye!',
        conditionalBlocks: [
          {
            id: 1,
            if: {
              firstText: '',
              secondText: '1',
              conditionalBlocks: [],
            },
            then: {
              firstText: 'then',
              secondText: '',
              conditionalBlocks: [],
            },
            else: {
              firstText: 'else',
              secondText: '',
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
        finalMessage: 'Bye!',
        conditionalBlocks: [
          {
            id: 1,
            if: {
              firstText: '',
              secondText: '',
              conditionalBlocks: [],
            },
            then: {
              firstText: 'then',
              secondText: '',
              conditionalBlocks: [],
            },
            else: {
              firstText: 'else',
              secondText: '',
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
        finalMessage: 'Bye!',
        conditionalBlocks: [
          {
            id: 1,
            if: {
              firstText: ' ',
              secondText: '',
              conditionalBlocks: [],
            },
            then: {
              firstText: 'then',
              secondText: '',
              conditionalBlocks: [],
            },
            else: {
              firstText: 'else',
              secondText: '',
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
        finalMessage: ' Bye!',
        conditionalBlocks: [
          {
            id: 1,
            if: {
              firstText: '',
              secondText: '',
              conditionalBlocks: [
                {
                  id: 2,
                  if: {
                    firstText: '',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    firstText: 'then',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    firstText: 'else',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            then: {
              firstText: 'then',
              secondText: '',
              conditionalBlocks: [],
            },
            else: {
              firstText: 'else',
              secondText: '',
              conditionalBlocks: [],
            },
          },
        ],
      };
      values = {};
      arrVarNames = [];
      expect(generateMessage(template, values, arrVarNames)).toBe('Hello! then Bye!');
    });

    it('nested true if with firsttext', () => {
      template = {
        startMessage: 'Hello! ',
        finalMessage: ' Bye!',
        conditionalBlocks: [
          {
            id: 1,
            if: {
              firstText: 'true',
              secondText: '',
              conditionalBlocks: [
                {
                  id: 2,
                  if: {
                    firstText: '',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    firstText: '',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    firstText: '',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            then: {
              firstText: 'then',
              secondText: '',
              conditionalBlocks: [],
            },
            else: {
              firstText: 'else',
              secondText: '',
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
        finalMessage: ' Bye!',
        conditionalBlocks: [
          {
            id: 1,
            if: {
              firstText: '',
              secondText: 'true',
              conditionalBlocks: [
                {
                  id: 2,
                  if: {
                    firstText: '',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    firstText: '',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    firstText: '',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            then: {
              firstText: 'then',
              secondText: '',
              conditionalBlocks: [],
            },
            else: {
              firstText: 'else',
              secondText: '',
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
        finalMessage: ' Bye!',
        conditionalBlocks: [
          {
            id: 1,
            if: {
              firstText: '',
              secondText: '',
              conditionalBlocks: [
                {
                  id: 2,
                  if: {
                    firstText: '',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    firstText: '',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    firstText: '',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            then: {
              firstText: 'then',
              secondText: '',
              conditionalBlocks: [],
            },
            else: {
              firstText: 'else',
              secondText: '',
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
        finalMessage: ' Bye!',
        conditionalBlocks: [
          {
            id: 1,
            if: {
              firstText: '',
              secondText: '',
              conditionalBlocks: [
                {
                  id: 2,
                  if: {
                    firstText: '',
                    secondText: '',
                    conditionalBlocks: [
                      {
                        id: 3,
                        if: {
                          firstText: '2',
                          secondText: '',
                          conditionalBlocks: [],
                        },
                        then: {
                          firstText: 'then2',
                          secondText: '',
                          conditionalBlocks: [],
                        },
                        else: {
                          firstText: 'else2',
                          secondText: '',
                          conditionalBlocks: [],
                        },
                      },
                    ],
                  },
                  then: {
                    firstText: 'then1',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    firstText: 'else1',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            then: {
              firstText: 'then',
              secondText: '',
              conditionalBlocks: [],
            },
            else: {
              firstText: 'else',
              secondText: '',
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
        finalMessage: ' Bye!',
        conditionalBlocks: [
          {
            id: 1,
            if: {
              firstText: '',
              secondText: '',
              conditionalBlocks: [
                {
                  id: 2,
                  if: {
                    firstText: '',
                    secondText: '',
                    conditionalBlocks: [
                      {
                        id: 3,
                        if: {
                          firstText: '2',
                          secondText: '',
                          conditionalBlocks: [],
                        },
                        then: {
                          firstText: '',
                          secondText: '',
                          conditionalBlocks: [],
                        },
                        else: {
                          firstText: 'else2',
                          secondText: '',
                          conditionalBlocks: [],
                        },
                      },
                    ],
                  },
                  then: {
                    firstText: 'then1',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    firstText: '',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            then: {
              firstText: 'then',
              secondText: '',
              conditionalBlocks: [],
            },
            else: {
              firstText: 'else',
              secondText: '',
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
        finalMessage: 'Bye!',
        conditionalBlocks: [
          {
            id: 1,
            if: {
              firstText: '1',
              secondText: '',
              conditionalBlocks: [],
            },
            then: {
              firstText: ' then',
              secondText: ', then continue ',
              conditionalBlocks: [
                {
                  id: 2,
                  if: {
                    firstText: '1',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    firstText: ', nested then',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    firstText: '',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            else: {
              firstText: '',
              secondText: '',
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
        finalMessage: 'Bye!',
        conditionalBlocks: [
          {
            id: 1,
            if: {
              firstText: '1',
              secondText: '',
              conditionalBlocks: [],
            },
            then: {
              firstText: ' then',
              secondText: ', then continue ',
              conditionalBlocks: [
                {
                  id: 2,
                  if: {
                    firstText: '',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    firstText: ', nested then',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    firstText: ', nested else',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                },
              ],
            },
            else: {
              firstText: '',
              secondText: '',
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
        finalMessage: 'Bye!',
        conditionalBlocks: [
          {
            id: 1,
            if: {
              firstText: '',
              secondText: '',
              conditionalBlocks: [],
            },
            then: {
              firstText: ' then',
              secondText: ', then continue ',
              conditionalBlocks: [],
            },
            else: {
              firstText: ' else',
              secondText: ', else continue ',
              conditionalBlocks: [
                {
                  id: 2,
                  if: {
                    firstText: '1',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    firstText: ', nested then',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    firstText: ', nested else',
                    secondText: '',
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
        finalMessage: 'Bye!',
        conditionalBlocks: [
          {
            id: 1,
            if: {
              firstText: '',
              secondText: '',
              conditionalBlocks: [],
            },
            then: {
              firstText: ' then',
              secondText: ', then continue ',
              conditionalBlocks: [],
            },
            else: {
              firstText: ' else',
              secondText: ', else continue ',
              conditionalBlocks: [
                {
                  id: 2,
                  if: {
                    firstText: '1',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  then: {
                    firstText: ', nested then',
                    secondText: '',
                    conditionalBlocks: [],
                  },
                  else: {
                    firstText: ', nested else',
                    secondText: '',
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
