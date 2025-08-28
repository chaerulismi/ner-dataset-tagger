# NER Dataset Creator

A simple web application for creating Named Entity Recognition (NER) datasets in HuggingFace format for model finetuning.

## Features

- **Simple Web Interface**: Easy-to-use web UI for text annotation
- **Entity Annotation**: Support for common entity types (PERSON, ORGANIZATION, LOCATION, DATE, MONEY) and custom types
- **Dataset Management**: Create and manage multiple datasets
- **HuggingFace Export**: Export datasets in the standard HuggingFace format with BIO tagging
- **Real-time Preview**: See your annotations as you create them

## Installation

### Option 1: Local Installation

1. Clone or download this repository
2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

### Option 2: Docker Installation (Recommended)

1. **Quick start with Docker Compose:**
```bash
# Build and run
docker-compose up --build

# Access at http://localhost:5000
```

2. **Production deployment:**
```bash
# Build and run production version
docker-compose -f docker-compose.prod.yml up --build
```

For detailed Docker instructions, see [DOCKER.md](DOCKER.md).

## Usage

### Development Mode (with Hot Reloading)

For development with automatic code reloading:

```bash
# Option 1: Use the development script (recommended)
python dev.py

# Option 2: Use the shell script
./start-dev.sh

# Option 3: Set environment variable and run normally
export FLASK_ENV=development
python app.py
```

### Production Mode

```bash
export FLASK_ENV=production
python app.py
```

### Standard Usage

1. **Start the application** using one of the methods above
2. **Open your browser** and navigate to `http://localhost:5000`

3. **Create a dataset**:
   - Enter a dataset name
   - Input text to annotate
   - Select entity types and mark entities
   - Save annotations

4. **Export your dataset**:
   - Click "Export HF Format" to download the dataset in HuggingFace format

## How to Annotate

1. **Enter Text**: Paste or type the text you want to annotate
2. **Select Entity Type**: Choose from predefined types or create custom ones
3. **Mark Entities**: Select text in the input area or type entity text manually
4. **Add Entity**: Click "Add Entity" to add the annotation
5. **Save**: Click "Save Annotation" to store the annotation in your dataset

## Output Format

The exported dataset follows the HuggingFace standard format:

```json
[
  {
    "tokens": ["John", "lives", "in", "New", "York"],
    "ner_tags": ["B-PERSON", "O", "O", "B-LOCATION", "I-LOCATION"]
  }
]
```

Where:
- `B-` indicates the beginning of an entity
- `I-` indicates the continuation of an entity
- `O` indicates tokens that are not part of any entity

## Development

### Hot Reloading

The development server automatically reloads when you make changes to:
- Python files (`.py`)
- HTML templates (`.html`)
- Static files (CSS, JavaScript)

**No need to restart the server!** Just save your files and the changes will be reflected immediately.

### Development Scripts

- `dev.py` - Development server with hot reloading enabled
- `start-dev.sh` - Shell script to start development server (includes dependency installation)

### Environment Variables

- `FLASK_ENV=development` - Enables debug mode and hot reloading
- `FLASK_ENV=production` - Disables debug mode for production use
- `PORT` - Set custom port (default: 5000)



## API Endpoints

- `GET /` - Main interface
- `POST /api/save_annotation` - Save a new annotation
- `GET /api/get_datasets` - List all datasets
- `GET /api/get_annotations/<dataset_name>` - Get annotations for a dataset
- `GET /api/export_hf_format/<dataset_name>` - Export dataset in HuggingFace format

## Example Usage

1. Start the app and navigate to the web interface
2. Create a dataset named "sample_ner"
3. Input text: "John Smith works at Microsoft in Seattle"
4. Add entities:
   - "John Smith" as PERSON
   - "Microsoft" as ORGANIZATION
   - "Seattle" as LOCATION
5. Save the annotation
6. Export the dataset to get a JSON file ready for HuggingFace model training

## Requirements

- Python 3.7+
- Flask 2.3.3
- Modern web browser

## Notes

- This is a development version that stores data in memory
- For production use, consider adding a database backend
- The current tokenization is simple (space-based) - for more complex languages, you may need to implement custom tokenization
