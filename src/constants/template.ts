import { ITemplate } from '../services/template.service';

export const DEFAULT_TEMPLATE: ITemplate = {
  startMessage: 'Hello {firstname} {lastname}!\n\n',
  conditionalBlocks: [
    {
      id: 3,
      if: {
        startMessage: '{company}',
        conditionalBlocks: [],
      },
      then: {
        startMessage: 'I know you work at {company}',
        conditionalBlocks: [
          {
            id: 4,
            if: {
              startMessage: '{position}',
              conditionalBlocks: [],
            },
            then: {
              startMessage: 'as {position}',
              conditionalBlocks: [],
            },
            else: {
              startMessage: ', but whats you role?',
              conditionalBlocks: [],
            },
            finalMessage: ' :)',
          },
        ],
      },
      else: {
        startMessage: '',
        conditionalBlocks: [
          {
            id: 6,
            if: {
              startMessage: '{position}',
              conditionalBlocks: [],
            },
            then: {
              startMessage: 'You seem to have a {position}, so where do you work?',
              conditionalBlocks: [],
            },
            else: {
              startMessage: 'Where do you work?',
              conditionalBlocks: [],
            },
            finalMessage: '',
          },
        ],
      },
      finalMessage: '\nWould you like to take a walk sometime?\n\n',
    },
    {
      id: 5,
      if: {
        startMessage: '{company}',
        conditionalBlocks: [],
      },
      then: {
        startMessage: 'Look at the work schedule for your convenience',
        conditionalBlocks: [],
      },
      else: {
        startMessage: "You don't work, so check when it's convenient.",
        conditionalBlocks: [],
      },
      finalMessage: '\nBye {firstname} {lastname}!',
    },
  ],
};
