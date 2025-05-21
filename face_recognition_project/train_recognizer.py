import cv2
import os
import numpy as np

dataset_path = 'dataset'

# Prepare training data
faces = []
labels = []
label_map = {}
current_label = 0

for person_name in os.listdir(dataset_path):
    person_path = os.path.join(dataset_path, person_name)
    if not os.path.isdir(person_path):
        continue

    label_map[current_label] = person_name
    for img_name in os.listdir(person_path):
        img_path = os.path.join(person_path, img_name)
        img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
        # Resize image to fixed size
        img = cv2.resize(img, (200, 200))
        faces.append(img)
        labels.append(current_label)
    current_label += 1

labels_np = np.array(labels)

# Initialize LBPH face recognizer
recognizer = cv2.face.LBPHFaceRecognizer_create()

# Train recognizer
recognizer.train(faces, labels_np)

# Save model and label map
recognizer.save('face_model.yml')

import pickle
with open('labels.pkl', 'wb') as f:
    pickle.dump(label_map, f)

print("Training complete and model saved.")
