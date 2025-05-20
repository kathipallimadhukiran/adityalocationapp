import os
import cv2
import joblib
import numpy as np
import pandas as pd
from datetime import date, datetime
from flask import Flask, request, render_template, redirect, url_for
from sklearn.neighbors import KNeighborsClassifier

# Flask App Initialization
app = Flask(__name__)

# Date formats
datetoday = date.today().strftime("%m_%d_%y")
datetoday2 = date.today().strftime("%d-%B-%Y")

# Load Haar cascade
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
cascade_path = os.path.join(BASE_DIR, 'haarcascade_frontalface_default.xml')
face_detector = cv2.CascadeClassifier(cascade_path)
if face_detector.empty():
    raise IOError(f"Failed to load Haar cascade. Ensure 'haarcascade_frontalface_default.xml' exists at: {cascade_path}")

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
    return len(os.listdir('static/faces'))

def extract_faces(img):
    if img is not None:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        return face_detector.detectMultiScale(gray, 1.3, 5)
    return []

def identify_face(facearray):
    model = joblib.load('static/face_recognition_model.pkl')
    return model.predict(facearray)

def train_model():
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
    df = pd.read_csv(attendance_file)
    if 'Time' not in df.columns:
        df['Time'] = ''
    return df['Name'], df['Roll'], df['Time'], len(df)

def add_attendance(name):
    username, userid = name.split('_')
    current_time = datetime.now().strftime("%H:%M:%S")
    df = pd.read_csv(attendance_file)
    if str(userid) not in df['Roll'].astype(str).values:
        with open(attendance_file, 'a') as f:
            f.write(f'{username},{userid},{current_time}\n')

# ---------------- Routes ---------------- #

@app.route('/')
def index():
    names, rolls, times, l = extract_attendance()
    return render_template('index.html', names=names, rolls=rolls, times=times, l=l,
                           totalreg=totalreg(), datetoday2=datetoday2)

@app.route('/start')
def start():
    if 'face_recognition_model.pkl' not in os.listdir('static'):
        return render_template('index.html', totalreg=totalreg(), datetoday2=datetoday2,
                               mess='No trained model found. Please add a new face to continue.')

    cap = cv2.VideoCapture(0)
    attended_users = set()

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        faces = extract_faces(frame)
        for (x, y, w, h) in faces:
            face = cv2.resize(frame[y:y + h, x:x + w], (50, 50))
            identified_person = identify_face(face.reshape(1, -1))[0]

            if identified_person not in attended_users:
                add_attendance(identified_person)
                attended_users.add(identified_person)

            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(frame, identified_person, (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 20), 2)

        cv2.imshow('Attendance Check', frame)
        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

    names, rolls, times, l = extract_attendance()
    return render_template('navbar_logout.html', names=names, rolls=rolls,
                           times=times, l=l, totalreg=totalreg(), datetoday2=datetoday2)

@app.route('/add', methods=['POST'])
def add():
    newusername = request.form['newusername']
    newuserid = request.form['newuserid']
    user_dir = f'static/faces/{newusername}_{newuserid}'

    if not os.path.exists(user_dir):
        os.makedirs(user_dir)

    cap = cv2.VideoCapture(0)
    i, j = 0, 0

    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        faces = extract_faces(frame)
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 20), 2)
            cv2.putText(frame, f'Images Captured: {i}/50', (30, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 20), 2)

            if j % 10 == 0 and i < 50:
                face_img = frame[y:y + h, x:x + w]
                cv2.imwrite(f'{user_dir}/{newusername}_{i}.jpg', face_img)
                i += 1
            j += 1

        if i >= 50 or cv2.waitKey(1) & 0xFF == 27:
            break

        cv2.imshow('Adding New User', frame)

    cap.release()
    cv2.destroyAllWindows()

    train_model()
    return redirect(url_for('index'))

# ---------------- Main Entry Point ---------------- #

if __name__ == '__main__':
    app.run(debug=True, port=1000)
