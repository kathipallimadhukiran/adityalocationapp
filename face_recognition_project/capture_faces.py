import cv2
import os

# Create dataset directory if not exists
dataset_path = 'dataset'
person_name = input("Enter your name: ")
person_path = os.path.join(dataset_path, person_name)
os.makedirs(person_path, exist_ok=True)

# Initialize webcam
cap = cv2.VideoCapture(0)

# Load OpenCV pre-trained face detector (Haar cascade)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

print("Look at the camera and wait... Press 'q' to quit")

count = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x,y,w,h) in faces:
        count += 1
        # Save the face region
        face_img = gray[y:y+h, x:x+w]
        cv2.imwrite(f"{person_path}/{person_name}_{count}.jpg", face_img)

        # Draw rectangle around face
        cv2.rectangle(frame, (x,y), (x+w, y+h), (255,0,0), 2)

    cv2.imshow('Capturing faces', frame)

    # Quit if 'q' pressed or 100 images collected
    if cv2.waitKey(1) & 0xFF == ord('q') or count >= 100:
        break

cap.release()
cv2.destroyAllWindows()
print(f"Collected {count} images for {person_name}")
