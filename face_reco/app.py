import os
import cv2
import joblib
import numpy as np
import pandas as pd
from datetime import date, datetime
from flask import Flask, request, render_template, redirect, url_for, jsonify
from sklearn.neighbors import KNeighborsClassifier

# Flask App Initialization
app = Flask(__name__)

# Date formats
datetoday = date.today().strftime("%m_%d_%y")
datetoday2 = date.today().strftime("%d-%B-%Y")

# Load Haar cascade for face detection
face_detector = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

# Setup necessary directories
os.makedirs('Attendance', exist_ok=True)
os.makedirs('static/faces', exist_ok=True)

# Create today's attendance file if not already present
attendance_file = f'Attendance/Attendance-{datetoday}.csv'
if not os.path.exists(attendance_file):
    with open(attendance_file, 'w') as f:
        f.write('Name,Roll,Time\n')

# ---------------- Helper Functions ---------------- #

def totalreg():
    """Returns the total number of registered users."""
    return len(os.listdir('static/faces'))

def extract_faces(img):
    """Extract faces from the input image."""
    if img is not None:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        return face_detector.detectMultiScale(gray, 1.3, 5)
    return []

def identify_face(facearray):
    """Identify the face using a trained model."""
    model = joblib.load('static/face_recognition_model.pkl')
    return model.predict(facearray)

def train_model():
    """Train the face recognition model using images from the registered users."""
    faces, labels = [], []
    for user in os.listdir('static/faces'):
        for imgname in os.listdir(f'static/faces/{user}'):
            img = cv2.imread(f'static/faces/{user}/{imgname}')
            if img is not None:
                resized_face = cv2.resize(img, (50, 50))
                faces.append(resized_face.ravel())
                labels.append(user)
    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(np.array(faces), labels)
    joblib.dump(knn, 'static/face_recognition_model.pkl')

def extract_attendance():
    """Extract attendance from the CSV file."""
    df = pd.read_csv(attendance_file)
    
    # Check if the 'Time' column exists, if not, create it
    if 'Time' not in df.columns:
        df['Time'] = ''  # You can set a default value or leave it blank
    
    return df['Name'], df['Roll'], df['Time'], len(df)

def add_attendance(name):
    """Add attendance entry for a recognized face."""
    username, userid = name.split('_')
    current_time = datetime.now().strftime("%H:%M:%S")
    df = pd.read_csv(attendance_file)
    if str(userid) not in df['Roll'].astype(str).values:
        with open(attendance_file, 'a') as f:
            f.write(f'{username},{userid},{current_time}\n')

# ---------------- Routes ---------------- #

@app.route('/')
def index():
    """Main page that shows the attendance."""
    names, rolls, times, l = extract_attendance()
    return render_template('index.html', names=names, rolls=rolls, times=times, l=l,
                           totalreg=totalreg(), datetoday2=datetoday2)

@app.route('/upload', methods=['POST'])
def upload():
    """
    Receive image file via POST, detect and recognize faces,
    mark attendance, and return JSON response.
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image file part'}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({'error': 'No selected image'}), 400

    # Convert image file to OpenCV format
    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({'error': 'Invalid image data'}), 400

    faces = extract_faces(img)
    if len(faces) == 0:
        return jsonify({'error': 'No faces detected'}), 400

    # Load model once here
    if not os.path.exists('static/face_recognition_model.pkl'):
        return jsonify({'error': 'No trained model found'}), 500

    model = joblib.load('static/face_recognition_model.pkl')
    recognized_people = []

    for (x, y, w, h) in faces:
        face = cv2.resize(img[y:y+h, x:x+w], (50, 50))
        pred = model.predict(face.reshape(1, -1))[0]
        add_attendance(pred)
        recognized_people.append(pred)

    return jsonify({'recognized': recognized_people, 'message': 'Attendance marked successfully'})

@app.route('/add', methods=['POST'])
def add():
    """
    Add a new user by uploading multiple images in a form-data POST request.
    Images must be uploaded with key 'images' (multiple files).
    """
    newusername = request.form.get('newusername')
    newuserid = request.form.get('newuserid')

    if not newusername or not newuserid:
        return jsonify({'error': 'Missing newusername or newuserid'}), 400

    user_dir = f'static/faces/{newusername}_{newuserid}'
    os.makedirs(user_dir, exist_ok=True)

    images = request.files.getlist('images')
    if not images or len(images) == 0:
        return jsonify({'error': 'No images uploaded'}), 400

    saved_count = 0
    for i, file in enumerate(images):
        file_bytes = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        if img is not None:
            cv2.imwrite(f'{user_dir}/{newusername}_{i}.jpg', img)
            saved_count += 1

    if saved_count == 0:
        return jsonify({'error': 'No valid images saved'}), 400

    train_model()
    return jsonify({'message': f'Successfully added {saved_count} images for {newusername}_{newuserid}'})


# ---------------- Main Entry Point ---------------- #

if __name__ == '__main__':
    app.run(debug=True, port=1000)
