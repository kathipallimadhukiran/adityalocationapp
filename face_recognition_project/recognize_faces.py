import cv2
import pickle
import time

# Load model and labels
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read('face_model.yml')

with open('labels.pkl', 'rb') as f:
    label_map = pickle.load(f)

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

cap = cv2.VideoCapture(0)

max_attempts = 50
attempt = 0
matched = False

while attempt < max_attempts and not matched:
    ret, frame = cap.read()
    if not ret:
        print("Failed to capture frame")
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        face_img = gray[y:y+h, x:x+w]
        label, confidence = recognizer.predict(face_img)

        if confidence < 70:  # Match found
            name = label_map[label]
            print(f"Face recognized: {name} with confidence {confidence:.2f}")
            matched = True
            break  # Stop after first matched face

    attempt += 1
    # Optional: small delay to avoid high CPU usage and allow camera to adjust
    time.sleep(0.1)

if not matched:
    print("No face matched after 50 attempts")

cap.release()
