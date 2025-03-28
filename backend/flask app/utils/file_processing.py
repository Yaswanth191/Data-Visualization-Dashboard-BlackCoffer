import pandas as pd
import json
from models import insert_data

def process_file(file_path, append=False):
    file_ext = file_path.rsplit('.', 1)[1].lower()
    try:
        if file_ext == 'json':
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        elif file_ext == 'csv':
            data = pd.read_csv(file_path).to_dict('records')
        elif file_ext in ('xlsx', 'xls'):
            data = pd.read_excel(file_path).to_dict('records')
        else:
            return {'error': 'Unsupported file type'}
        
        return insert_data(data, append)
    except Exception as e:
        return {'error': f'Error processing file: {str(e)}'}
