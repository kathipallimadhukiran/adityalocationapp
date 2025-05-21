from flask import Flask, request, jsonify
import os
import base64

app = Flask(__name__)
DATASET_PATH = 'dataset'

@app.route('/upload_face', methods=['POST'])
def upload_face():
    data = request.json
    person_name = data.get('person_name')
    img_data = data.get('image_base64')  # Expect base64 string like "data:image/jpeg;base64,..."

    if not person_name or not img_data:
        return jsonify({'error': 'Missing person_name or image_base64'}), 400

    # Create directory if not exists
    person_path = os.path.join(DATASET_PATH, person_name)
    os.makedirs(person_path, exist_ok=True)

    # Remove header if exists (e.g. "data:image/jpeg;base64,")
    if ',' in img_data:
        header, img_data = img_data.split(',', 1)

    # Decode base64 to bytes
    img_bytes = base64.b64decode(img_data)

    # Save image with incremental name
    count = len(os.listdir(person_path)) + 1
    img_path = os.path.join(person_path, f"{person_name}_{count}.jpg")

    with open(img_path, 'wb') as f:
        f.write(img_bytes)

    return jsonify({'message': 'Image saved', 'filename': img_path})

if __name__ == '__main__':
    app.run(debug=True)
