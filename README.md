# NER Dataset Tagger

A modern web application for creating and annotating Named Entity Recognition (NER) training datasets that are compatible with HuggingFace models.

## Features

- **Interactive Text Annotation**: Click and drag to select text spans and assign entity types
- **Dataset Management**: Create, organize, and manage multiple NER datasets
- **Entity Type Customization**: Define custom entity types for your specific domain
- **HuggingFace Compatibility**: Export datasets in the exact format needed for training
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Real-time Validation**: Prevent overlapping entities and ensure data quality
- **Multiple Export Formats**: Support for HuggingFace JSON and CoNLL formats

## Screenshots

The application provides an intuitive interface for:
- Creating and managing datasets
- Adding text samples for annotation
- Interactive text selection and entity labeling
- Viewing annotation progress and statistics
- Exporting datasets for model training

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React Context + useReducer

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ner-dataset-tagger
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## Usage

### 1. Create a Dataset

1. Navigate to the "Datasets" page
2. Click "Create Dataset"
3. Enter a name and description for your dataset
4. Click "Create Dataset"

### 2. Add Text Samples

1. Go to the "Annotate" page
2. Select your dataset from the dropdown
3. Click "Add Sample" and enter your text
4. Click "Add Sample" to save

### 3. Annotate Entities

1. Select an entity type from the dropdown (e.g., PERSON, ORGANIZATION)
2. Click and drag to select text in the text area
3. Click "Add Entity" to create the annotation
4. Repeat for all entities in the text

### 4. Export Dataset

1. Navigate to the "Datasets" page
2. Click the download icon on your dataset
3. The dataset will be exported in HuggingFace-compatible format

## Data Format

### HuggingFace Format

The exported dataset follows the standard HuggingFace NER format:

```json
[
  {
    "text": "John Smith works at Microsoft in Seattle.",
    "entities": [
      {
        "start": 0,
        "end": 10,
        "label": "PERSON"
      },
      {
        "start": 20,
        "end": 28,
        "label": "ORGANIZATION"
      },
      {
        "start": 32,
        "end": 38,
        "label": "LOCATION"
      }
    ]
  }
]
```

### CoNLL Format

For CoNLL-2003 compatibility:

```
John B-PERSON
Smith I-PERSON
works O
at O
Microsoft B-ORGANIZATION
in O
Seattle B-LOCATION
. O
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── TextAnnotator.tsx # Core annotation component
│   └── DatasetSelector.tsx # Dataset selection
├── contexts/           # React context providers
│   └── NERContext.tsx # Main state management
├── pages/             # Page components
│   ├── Home.tsx       # Landing page
│   ├── Annotator.tsx  # Annotation interface
│   └── DatasetManager.tsx # Dataset management
├── utils/             # Utility functions
│   └── helpers.ts     # Helper functions
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with modern web technologies for optimal performance and user experience
- Designed specifically for machine learning practitioners and researchers
- Inspired by the need for high-quality NER training data

## Support

If you encounter any issues or have questions, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

---

**Happy Annotating! 🏷️**