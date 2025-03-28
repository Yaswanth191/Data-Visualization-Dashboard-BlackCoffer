from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from config import Config
from utils.file_processing import process_file

file_bp = Blueprint('file_bp', __name__)

@file_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS:
        filename = secure_filename(file.filename)
        file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(file_path)

        option = request.form.get('option', 'replace')
        append = option.lower() == 'append'

        result = process_file(file_path, append)

        os.remove(file_path)  # Clean up after processing
        return jsonify(result)
    
    return jsonify({'error': 'File type not allowed'}), 400
