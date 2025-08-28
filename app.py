from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import json
import os
import tempfile
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for development

# Store datasets in memory (in production, use a database)
datasets = {}

# Clean up old temporary files on startup
def cleanup_old_temp_files():
    """Clean up any old temporary files that might have been left behind"""
    temp_dir = tempfile.gettempdir()
    cleaned_count = 0
    for item in os.listdir(temp_dir):
        if item.startswith('ner_export_'):
            item_path = os.path.join(temp_dir, item)
            try:
                if os.path.isdir(item_path):
                    # Remove directory and contents
                    import shutil
                    shutil.rmtree(item_path)
                    cleaned_count += 1
                elif os.path.isfile(item_path):
                    # Remove single file
                    os.remove(item_path)
                    cleaned_count += 1
            except OSError:
                pass  # Ignore cleanup errors
    
    if cleaned_count > 0:
        print(f"Cleaned up {cleaned_count} old temporary export files")

# Run cleanup on startup
cleanup_old_temp_files()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/save_annotation', methods=['POST'])
def save_annotation():
    data = request.json
    text = data.get('text', '')
    entities = data.get('entities', [])
    dataset_name = data.get('dataset_name', 'default')
    
    if dataset_name not in datasets:
        datasets[dataset_name] = []
    
    # Create annotation in HuggingFace format
    annotation = {
        'id': len(datasets[dataset_name]),
        'text': text,
        'entities': entities
    }
    
    datasets[dataset_name].append(annotation)
    
    return jsonify({'success': True, 'message': 'Annotation saved successfully'})



@app.route('/api/get_datasets')
def get_datasets():
    return jsonify(list(datasets.keys()))

@app.route('/api/get_annotations/<dataset_name>')
def get_annotations(dataset_name):
    if dataset_name in datasets:
        return jsonify(datasets[dataset_name])
    return jsonify([])

@app.route('/api/export_hf_format/<dataset_name>')
def export_hf_format(dataset_name):
    if dataset_name not in datasets:
        return jsonify({'error': 'Dataset not found'}), 404
    
    # Convert to HuggingFace format
    hf_format = []
    for item in datasets[dataset_name]:
        # Create tokens and labels
        text = item['text']
        entities = item['entities']
        
        # Improved tokenization (split by space and handle punctuation)
        tokens = []
        current_token = ""
        
        for char in text:
            if char.isspace():
                if current_token:
                    tokens.append(current_token)
                    current_token = ""
            elif char in ',.!?;:':
                if current_token:
                    tokens.append(current_token)
                    current_token = ""
                tokens.append(char)
            else:
                current_token += char
        
        if current_token:
            tokens.append(current_token)
        
        labels = ['O'] * len(tokens)
        print(f"Text: '{text}'")
        print(f"Tokens: {tokens}")
        
        # Apply entity labels
        entity_conflicts = []
        
        for entity in entities:
            entity_text = entity['text']
            entity_type = entity['type']
            
            # Tokenize the entity text the same way
            entity_tokens = []
            current_token = ""
            
            for char in entity_text:
                if char.isspace():
                    if current_token:
                        entity_tokens.append(current_token)
                        current_token = ""
                elif char in ',.!?;:':
                    if current_token:
                        entity_tokens.append(current_token)
                        current_token = ""
                    entity_tokens.append(char)
                else:
                    current_token += char
            
            if current_token:
                entity_tokens.append(current_token)
            
            # Find the entity tokens in the main token list
            for i in range(len(tokens) - len(entity_tokens) + 1):
                if tokens[i:i+len(entity_tokens)] == entity_tokens:
                    # Check for conflicts
                    conflict_detected = False
                    for j in range(len(entity_tokens)):
                        if labels[i+j] != 'O':
                            conflict_detected = True
                            old_label = labels[i+j]
                            entity_conflicts.append({
                                'token': tokens[i+j],
                                'position': i+j,
                                'old_entity': old_label,
                                'new_entity': f'{entity_type}',
                                'text': entity_text
                            })
                    
                    # Apply labels
                    for j in range(len(entity_tokens)):
                        if j == 0:
                            labels[i+j] = f'B-{entity_type}'
                        else:
                            labels[i+j] = f'I-{entity_type}'
                    
                    if conflict_detected:
                        print(f"⚠️  CONFLICT: '{entity_text}' ({entity_type}) overwrites existing label at position {i}")
                    else:
                        print(f"Found entity '{entity_text}' ({entity_type}) at position {i}, tokens: {entity_tokens}, labels: {labels[i:i+len(entity_tokens)]}")
                    break
        
        # Report conflicts if any
        if entity_conflicts:
            print(f"\n🚨 Entity Conflicts Detected ({len(entity_conflicts)}):")
            for conflict in entity_conflicts:
                print(f"  - Token '{conflict['token']}' at position {conflict['position']}: {conflict['old_entity']} → {conflict['new_entity']} (from '{conflict['text']}')")
            print("  Note: Conflicts occur when the same token position is tagged by multiple entities.\n")
        
        hf_format.append({
            'tokens': tokens,
            'ner_tags': labels
        })
    
    # Create export file in temporary directory
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f'{dataset_name}_{timestamp}.json'
    
    # Create temporary file
    temp_dir = tempfile.mkdtemp(prefix='ner_export_')
    temp_file_path = os.path.join(temp_dir, filename)
    
    print(f"Creating temporary export file: {temp_file_path}")
    
    with open(temp_file_path, 'w') as f:
        json.dump(hf_format, f, indent=2)
    
    # Send file and clean up after sending
    response = send_file(
        temp_file_path, 
        as_attachment=True, 
        download_name=filename
    )
    
    # Clean up temporary file after response is sent
    @response.call_on_close
    def cleanup():
        try:
            os.remove(temp_file_path)
            os.rmdir(temp_dir)
        except OSError:
            pass  # Ignore cleanup errors
    
    return response

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    
    # Enable debug mode by default for development (hot reloading)
    # Set FLASK_ENV=production to disable debug mode
    debug = os.environ.get('FLASK_ENV') != 'production'
    
    print(f"🚀 Starting Flask app in {'debug' if debug else 'production'} mode")
    print(f"📱 Hot reloading is {'enabled' if debug else 'disabled'}")
    print(f"🌐 Server will be available at: http://localhost:{port}")
    
    app.run(
        debug=debug,
        host='0.0.0.0',  # Allow external connections
        port=port,
        use_reloader=debug  # Enable auto-reloader in debug mode
    )
