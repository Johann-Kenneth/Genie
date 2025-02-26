import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
from PIL import Image
import numpy as np
import cv2
from stylist import PersonalStylist
from recommender import FashionRecommender
import google.generativeai as genai
import requests

load_dotenv()
# Load API key securely from environment variable
API_KEY = os.getenv("OPENAI_API_KEY")
if not API_KEY:
    raise ValueError("Missing OpenAI API Key! Set it as an environment variable.")

genai.configure(api_key=API_KEY)

app = Flask(__name__, static_url_path='/images', static_folder='images')
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Initialize classes
stylist = PersonalStylist()
recommender = FashionRecommender()

# Ensure uploads folder exists
if not os.path.exists('uploads'):
    os.makedirs('uploads')

# ----------------- PERSONAL STYLIST ENDPOINT -----------------
@app.route('/upload', methods=['POST'])
def stylist_analysis():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    image = Image.open(file)
    image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    occasion = request.form.get('occasion', 'casual').lower()
    
    try:
        skin_tone = stylist.detect_skin_tone(image)
        body_shape = stylist.detect_body_shape(image)
        recommendations = stylist.get_recommendations(skin_tone, body_shape, occasion)

        return jsonify({
            "skin_tone": skin_tone,
            "body_shape": body_shape,
            "recommendations": recommendations
        })

    except Exception as e:
        print("Error processing image:", str(e))
        return jsonify({"error": "Failed to process image", "details": str(e)}), 500

# ----------------- FASHION RECOMMENDATION ENDPOINT -----------------
@app.route('/recommender', methods=['POST'])
def fashion_recommendation():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    filename = os.path.join('uploads', file.filename)
    file.save(filename)

    try:
        recommendations = recommender.recommend(filename)

        recommendations_with_links = [
            {
                "image": f"images/{os.path.basename(image_path)}",
                "purchase_link": f"http://localhost:3000/purchase?image={os.path.basename(image_path)}"
            }
            for image_path in recommendations
        ]

        return jsonify({
            "uploaded_image": filename,
            "recommendations": recommendations_with_links
        })

    except Exception as e:
        print("Error generating recommendations:", str(e))
        return jsonify({"error": "Failed to generate recommendations", "details": str(e)}), 500

# ----------------- SERVE IMAGE ENDPOINT -----------------
@app.route('/<path:filename>')
def serve_image(filename):
    try:
        return send_from_directory('images', filename)
    except Exception as e:
        print("Error serving image:", str(e))
        return jsonify({"error": "Image not found"}), 404

# ----------------- OUTFIT SUGGESTION ENDPOINT -----------------
@app.route('/outfit-suggestion', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def outfit_suggestion():
    try:
        data = request.json
        print("Received Data:", data)

        gender = data.get("gender")
        occasion = data.get("occasion")
        climate = data.get("climate")
        mood = data.get("mood")
        user_input = data.get("user_input", "")

        if not all([gender, occasion, climate, mood]):
            return jsonify({"error": "All fields (gender, occasion, climate, mood) are required"}), 400

        # Generate an outfit suggestion using Google Generative AI
        model = genai.GenerativeModel("gemini-1.0-pro")
        prompt = (
            f"Give me an outfit suggestion for a {gender} for a {occasion} "
            f"considering the climate '{climate}' and mood '{mood}', based on the following input: {user_input}"
        )
        
        response = model.generate_content(prompt)
        suggestion = response.text if response else "No suggestion available"

        return jsonify({"outfit_suggestion": suggestion})

    except Exception as e:
        print("Error generating outfit suggestion:", str(e))
        return jsonify({"error": "Failed to generate outfit suggestion", "details": str(e)}), 500

# ----------------- RUN THE FLASK APP -----------------
if __name__ == '__main__':
    app.run(port=5000, debug=True)
