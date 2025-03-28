from flask import Blueprint, jsonify, request
from database import get_db_connection
from models import insert_data

data_bp = Blueprint('data_bp', __name__)

@data_bp.route('/data', methods=['GET'])
def get_data():
    limit = request.args.get('limit', default=None, type=int)
    offset = request.args.get('offset', default=0, type=int)

    conn = get_db_connection()
    c = conn.cursor()

    query = 'SELECT * FROM data'
    params = []

    if limit is not None:
        query += ' LIMIT ? OFFSET ?'
        params.extend([limit, offset])

    c.execute(query, params)
    rows = c.fetchall()

    columns = [column[0] for column in c.description]
    result = [dict(zip(columns, row)) for row in rows]

    conn.close()
    return jsonify(result)

@data_bp.route('/data/count', methods=['GET'])
def get_data_count():
    conn = get_db_connection()
    c = conn.cursor()

    c.execute('SELECT COUNT(*) FROM data')
    count = c.fetchone()[0]

    conn.close()
    return jsonify({'count': count})

@data_bp.route('/delete', methods=['DELETE'])
def delete_data():
    conn = get_db_connection()
    c = conn.cursor()

    c.execute('DELETE FROM data')
    conn.commit()

    c.execute('SELECT COUNT(*) FROM data')
    remaining = c.fetchone()[0]

    conn.close()
    return jsonify({
        'message': 'All data deleted successfully',
        'remaining': remaining
    })
