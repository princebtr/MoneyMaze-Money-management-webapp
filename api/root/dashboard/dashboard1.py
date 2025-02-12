from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import pandas as pd
import io

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Sample data source
data = {
    "id": [1, 2, 3],
    "name": ["Alice", "Bob", "Charlie"],
    "age": [25, 30, 22],
    "city": ["New York", "Los Angeles", "Chicago"]
}

df = pd.DataFrame(data)

# Endpoint for fetching filtered/custom reports
@app.route('/api/reports', methods=['POST'])
def generate_report():
    filters = request.json
    filtered_df = df

    # Apply filters based on incoming JSON data
    if 'name' in filters:
        filtered_df = filtered_df[filtered_df['name'].str.contains(filters['name'])]
    if 'city' in filters:
        filtered_df = filtered_df[filtered_df['city'] == filters['city']]

    report_data = filtered_df.to_dict(orient='records')
    return jsonify(report_data)

# Endpoint for exporting report to CSV
@app.route('/api/export/csv', methods=['POST'])
def export_csv():
    filters = request.json
    filtered_df = df

    # Apply filters (like in the generate_report function)
    if 'name' in filters:
        filtered_df = filtered_df[filtered_df['name'].str.contains(filters['name'])]
    if 'city' in filters:
        filtered_df = filtered_df[filtered_df['city'] == filters['city']]

    output = io.StringIO()
    filtered_df.to_csv(output, index=False)
    output.seek(0)
    
    return send_file(io.BytesIO(output.getvalue().encode('utf-8')),
                     mimetype='text/csv',
                     as_attachment=True,
                     download_name='report.csv')

# Endpoint for exporting report to Excel
@app.route('/api/export/excel', methods=['POST'])
def export_excel():
    filters = request.json
    filtered_df = df

    # Apply filters (like in the generate_report function)
    if 'name' in filters:
        filtered_df = filtered_df[filtered_df['name'].str.contains(filters['name'])]
    if 'city' in filters:
        filtered_df = filtered_df[filtered_df['city'] == filters['city']]

    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        filtered_df.to_excel(writer, index=False)
    output.seek(0)

    return send_file(output,
                     mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                     as_attachment=True,
                     download_name='report.xlsx')


if __name__ == '__main__':
    app.run(debug=True)
