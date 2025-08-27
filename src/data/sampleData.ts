import { NERDataset } from '../contexts/NERContext'

export const sampleDataset: NERDataset = {
  id: 'sample-1',
  name: 'Sample News Articles',
  description: 'A collection of news articles with named entities for demonstration purposes',
  samples: [
    {
      id: 'sample-1-1',
      text: 'Apple Inc. CEO Tim Cook announced today that the company will open a new office in San Francisco, California. The move comes as part of Apple\'s expansion strategy in the United States.',
      entities: [
        {
          id: 'entity-1',
          text: 'Apple Inc.',
          type: 'ORGANIZATION',
          start: 0,
          end: 9
        },
        {
          id: 'entity-2',
          text: 'Tim Cook',
          type: 'PERSON',
          start: 13,
          end: 21
        },
        {
          id: 'entity-3',
          text: 'San Francisco',
          type: 'LOCATION',
          start: 58,
          end: 71
        },
        {
          id: 'entity-4',
          text: 'California',
          type: 'LOCATION',
          start: 73,
          end: 83
        },
        {
          id: 'entity-5',
          text: 'United States',
          type: 'LOCATION',
          start: 135,
          end: 148
        }
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'sample-1-2',
      text: 'Microsoft Corporation reported quarterly earnings of $52.7 billion, exceeding analyst expectations. CEO Satya Nadella highlighted the company\'s cloud computing success.',
      entities: [
        {
          id: 'entity-6',
          text: 'Microsoft Corporation',
          type: 'ORGANIZATION',
          start: 0,
          end: 20
        },
        {
          id: 'entity-7',
          text: '$52.7 billion',
          type: 'MONEY',
          start: 35,
          end: 48
        },
        {
          id: 'entity-8',
          text: 'Satya Nadella',
          type: 'PERSON',
          start: 95,
          end: 108
        }
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'sample-1-3',
      text: 'The weather forecast for New York City shows temperatures reaching 85°F on Friday, July 15th. Meteorologists expect sunny conditions throughout the weekend.',
      entities: [
        {
          id: 'entity-9',
          text: 'New York City',
          type: 'LOCATION',
          start: 25,
          end: 38
        },
        {
          id: 'entity-10',
          text: '85°F',
          type: 'PERCENT',
          start: 58,
          end: 62
        },
        {
          id: 'entity-11',
          text: 'Friday',
          type: 'DATE',
          start: 66,
          end: 72
        },
        {
          id: 'entity-12',
          text: 'July 15th',
          type: 'DATE',
          start: 74,
          end: 83
        }
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ],
  entityTypes: ['PERSON', 'ORGANIZATION', 'LOCATION', 'DATE', 'MONEY', 'PERCENT', 'TIME'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
}

export const entityTypeExamples = {
  PERSON: ['John Smith', 'Mary Johnson', 'Dr. Robert Wilson', 'CEO Sarah Chen'],
  ORGANIZATION: ['Apple Inc.', 'Microsoft Corporation', 'Google LLC', 'Tesla Motors'],
  LOCATION: ['New York City', 'San Francisco', 'London', 'Tokyo', 'Paris'],
  DATE: ['January 15th', '2024-03-20', 'next Monday', 'last week'],
  MONEY: ['$1,000', '€500', '£250', '¥10,000'],
  PERCENT: ['85°F', '25°C', '100%', '50%'],
  TIME: ['9:00 AM', '3:30 PM', 'midnight', 'noon']
}

export const annotationTips = [
  'Select text by clicking and dragging across the words you want to annotate',
  'Choose the appropriate entity type from the dropdown before adding entities',
  'Avoid overlapping entities - each text span should only have one entity type',
  'Use consistent entity types across your dataset for better model training',
  'Include a variety of entity examples to improve model generalization',
  'Review your annotations regularly to ensure consistency and quality'
]
