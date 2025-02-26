import cv2
import numpy as np
import mediapipe as mp 
import gzip
import shutil
import os

compressed_file = 'pythonApp/models/Images_features.pkl.gz'
output_file = 'pythonApp/models/Images_features.pkl'

# Decompress only if the uncompressed file does not exist
if os.path.exists(compressed_file) and not os.path.exists(output_file):
    try:
        with gzip.open(compressed_file, 'rb') as f_in:
            with open(output_file, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        print(f'File {compressed_file} has been decompressed to {output_file}')
    except Exception as e:
        print(f"Error decompressing the file: {e}")


# PersonalStylist class
class PersonalStylist:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=True,
            model_complexity=2,
            enable_segmentation=True,
            min_detection_confidence=0.5
        )
        # Define clothing recommendations based on skin tone, body shape, and occasion
        self.clothing_db = {
            'formal': {
                'light_skin': {
                    'hourglass': ["Light blue shirt", "Beige trousers"],
                    'rectangle': ["Gray suit", "Dark blue pants"],
                    'pear': ["White blouse", "Black pencil skirt"]
                },
                'dark_skin': {
                    'hourglass': ["Black dress", "Red scarf"],
                    'rectangle': ["Black blazer", "Slim fit pants"],
                    'pear': ["Green blouse", "Brown skirt"]
                },
                'medium_skin': {
                    'hourglass': ["Navy blazer", "White skirt"],
                    'rectangle': ["Brown suit", "Black trousers"],
                    'pear': ["Pink blouse", "White dress"]
                }
            },
            'casual': {
                'light_skin': {
                    'hourglass': ["T-shirt", "Denim jeans"],
                    'rectangle': ["Tank top", "Shorts"],
                    'pear': ["Button-down shirt", "Cargo pants"]
                },
                'dark_skin': {
                    'hourglass': ["Yellow T-shirt", "Slim jeans"],
                    'rectangle': ["Red sweater", "Khaki pants"],
                    'pear': ["Black top", "Joggers"]
                },
                'medium_skin': {
                    'hourglass': ["Pink hoodie", "Black leggings"],
                    'rectangle': ["White shirt", "Chinos"],
                    'pear': ["Blue denim jacket", "Denim jeans"]
                }
            }
        }

    def detect_skin_tone(self, image):
        ycrcb_image = cv2.cvtColor(image, cv2.COLOR_BGR2YCrCb)
        lower_skin, upper_skin = np.array([0, 135, 85]), np.array([255, 180, 135])
        skin_mask = cv2.inRange(ycrcb_image, lower_skin, upper_skin)
        skin_region = cv2.bitwise_and(image, image, mask=skin_mask)

        if np.sum(skin_mask) > 0:
            average_color = np.mean(skin_region[skin_mask > 0], axis=0)
            brightness = np.mean(average_color)
            return "light_skin" if brightness > 150 else "dark_skin" if brightness < 100 else "medium_skin"

        return "medium_skin"

    def detect_body_shape(self, image):
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.pose.process(image_rgb)
        if not results.pose_landmarks:
            return "hourglass"  # Default shape if no landmarks are detected

        landmarks = results.pose_landmarks.landmark
        shoulder_width = abs(landmarks[11].x - landmarks[12].x)
        waist_width = abs(landmarks[23].x - landmarks[24].x)
        hip_width = abs(landmarks[23].x - landmarks[24].x)

        if abs(shoulder_width - hip_width) < 0.1 and waist_width < min(shoulder_width, hip_width):
            return "hourglass"
        elif abs(shoulder_width - hip_width) < 0.1:
            return "rectangle"
        return "pear"

    def get_recommendations(self, skin_tone, body_shape, occasion):
        # Ensure that all levels are dictionaries, not sets
        try:
            recommendations = self.clothing_db.get(occasion, {}).get(skin_tone, {}).get(body_shape, [])
            if not recommendations:
                recommendations = ["No recommendations available."]
        except KeyError as e:
            print(f"KeyError: {e}")
            recommendations = ["No recommendations available."]
        
        return recommendations
