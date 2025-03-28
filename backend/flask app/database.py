import sqlite3
from config import Config

def get_db_connection():
    conn = sqlite3.connect(Config.DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            topic TEXT,
            sector TEXT,
            region TEXT,
            country TEXT,
            source TEXT,
            end_year TEXT,
            intensity INTEGER,
            likelihood INTEGER,
            relevance INTEGER,
            pest TEXT,
            swot TEXT,
            url TEXT,
            added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Create indexes for better performance
    c.execute('CREATE INDEX IF NOT EXISTS idx_topic ON data (topic)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_country ON data (country)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_sector ON data (sector)')

    conn.commit()
    conn.close()
