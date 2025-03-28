from database import get_db_connection

def insert_data(data, append=False):
    conn = get_db_connection()
    c = conn.cursor()

    if not append:
        c.execute('DELETE FROM data')

    count = 0
    for item in data:
        try:
            c.execute('''
                INSERT INTO data (
                    title, topic, sector, region, country, 
                    source, end_year, intensity, likelihood, 
                    relevance, pest, swot, url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                item.get('title'), item.get('topic'), item.get('sector'), item.get('region'),
                item.get('country'), item.get('source'), str(item.get('end_year')) if item.get('end_year') else None,
                item.get('intensity'), item.get('likelihood'), item.get('relevance'),
                item.get('pest'), item.get('swot'), item.get('url')
            ))
            count += 1
        except Exception as e:
            print(f"Error inserting record: {e}")
            continue

    conn.commit()
    conn.close()
    return {'count': count, 'message': f'Successfully processed {count} records'}
