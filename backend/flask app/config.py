import os

class Config:
    UPLOAD_FOLDER = 'uploads'
    DATABASE = 'data.db'
    ALLOWED_EXTENSIONS = {'json', 'csv', 'xlsx', 'xls'}
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB limit

    # Ensure upload folder exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
