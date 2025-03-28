from flask import Flask
from flask_cors import CORS
from config import Config
from database import init_db
from routes.data_routes import data_bp
from routes.file_routes import file_bp

# Initialize app
app = Flask(__name__)
CORS(app)  # Enable CORS

# Configure app
app.config.from_object(Config)

# Initialize database
init_db()

# Register Blueprints
app.register_blueprint(data_bp, url_prefix='/api')
app.register_blueprint(file_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
