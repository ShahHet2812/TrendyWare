# stylist_app/logic.py
import os
import cv2
import io
import torch
import pickle
import base64
import requests
import numpy as np
from PIL import Image
from fashion_clip.fashion_clip import FashionCLIP
from insightface.app import FaceAnalysis
from django.conf import settings
import logging

# --- Model Initialization ---
# These models are loaded only ONCE when the Django app starts.
# This is the correct and efficient way to do it.
logger = logging.getLogger(__name__)
logger.info("Initializing AI models...")

try:
    face_app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
    face_app.prepare(ctx_id=0)
    fclip_model = FashionCLIP("fashion-clip")
    logger.info("✅ AI models initialized successfully.")
except Exception as e:
    logger.error(f"❌ Failed to initialize AI models: {e}", exc_info=True)
    face_app = None
    fclip_model = None

# --- Helper Functions ---

def apply_clahe(image_bgr):
    """Enhances image contrast for better feature detection."""
    lab = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    limg = cv2.merge((cl, a, b))
    return cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)

def detect_skin_tone(image_bgr):
    """Detects the user's skin tone from the image."""
    # Uses the globally loaded face_app model
    if not face_app: return None

    image = apply_clahe(image_bgr)
    faces = face_app.get(image)
    if not faces: return None

    face = max(faces, key=lambda f: f.bbox[2] - f.bbox[0])
    landmarks = face.landmark_2d_106
    sample_indices = [54, 76, 82, 46, 34, 72, 66, 40, 28, 88, 20, 23, 25]
    patches = []
    for idx in sample_indices:
        x, y = map(int, landmarks[idx])
        patch = image[y-10:y+10, x-10:x+10]
        if patch.shape[:2] == (20, 20):
            patches.append(patch)
    if not patches: return None

    all_pixels = np.vstack([p.reshape(-1, 3) for p in patches])
    valid_pixels = [px for px in all_pixels if np.all(30 < px) and np.all(px < 240)]
    if not valid_pixels: return None

    mean_bgr = np.mean(valid_pixels, axis=0).astype(np.uint8)
    hsv_pixel = cv2.cvtColor(np.uint8([[mean_bgr]]), cv2.COLOR_BGR2HSV)[0][0]
    v = hsv_pixel[2]
    if v > 200: return "very fair"
    elif 160 < v <= 200: return "fair"
    elif 120 < v <= 160: return "medium"
    else: return "dark"

def get_age_gender(image_bgr):
    """Detects the user's age and gender from the image."""
    # Uses the globally loaded face_app model
    if not face_app: return None, None

    faces = face_app.get(image_bgr)
    if not faces: return None, None

    face = max(faces, key=lambda f: f.bbox[2] - f.bbox[0])
    age = int(face.age)
    gender = "Female" if face.gender == 0 else "Male"
    return age, gender

def infer_age_group(age):
    """Categorizes age into a descriptive group."""
    if age < 13: return "child"
    elif age < 20: return "teen"
    elif age < 40: return "adult"
    else: return "senior"

def recommend_outfit(prompt, features, catalog, top_k=25):
    """Finds the best matching outfits based on the generated prompt."""
    # Uses the globally loaded fclip_model
    if not fclip_model: return []
    text_features = fclip_model.encode_text([prompt], batch_size=1)
    image_features = torch.tensor(features, dtype=torch.float32)
    similarity_scores = image_features @ text_features[0].T
    top_indices = torch.topk(similarity_scores, k=top_k).indices
    return [catalog[i]["image"] for i in top_indices]


# --- Main Service Function ---

def get_recommendations(uploaded_file, season, usage):
    """
    Processes an uploaded image to generate fashion recommendations
    based on detected user attributes.
    """
    if not face_app or not fclip_model:
        raise ValueError("AI models are not available. Please check server logs.")

    try:
        image_bytes = uploaded_file.read()
        image_np = np.frombuffer(image_bytes, np.uint8)
        image_bgr = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

        skin_tone = detect_skin_tone(image_bgr)
        age, gender = get_age_gender(image_bgr)

        if not all([skin_tone, age, gender]):
            raise ValueError("Could not detect face or features. Please try a clearer image.")

        age_group = infer_age_group(age)
        prompt = f"{usage} outfit for a {age_group} {gender.lower()} with {skin_tone} skin in {season}"
        logger.info(f"Generated Prompt: {prompt}")

        features_path = os.path.join(settings.BASE_DIR, 'stylist_app', 'pkl', 'cached_image_features.pkl')
        catalog_path = os.path.join(settings.BASE_DIR, 'stylist_app', 'pkl', 'cached_catalog.pkl')

        with open(features_path, "rb") as f:
            features = pickle.load(f)
        with open(catalog_path, "rb") as f:
            catalog = pickle.load(f)

        outfit_paths = recommend_outfit(prompt, features, catalog, top_k=25)

        results = []
        for path in outfit_paths:
            full_path = os.path.join(settings.BASE_DIR, path)
            if os.path.exists(full_path):
                with open(full_path, "rb") as f:
                    encoded_string = base64.b64encode(f.read()).decode()
                    results.append(f"data:image/jpeg;base64,{encoded_string}")
            else:
                logger.warning(f"Image not found at path: {full_path}")

        return {"outfits": results}

    except FileNotFoundError as e:
        logger.error(f"A required data file was not found. Details: {e}", exc_info=True)
        raise ValueError("Server configuration error: Missing model or data files.")
    except Exception as e:
        logger.error(f"An unexpected error occurred in get_recommendations: {e}", exc_info=True)
        raise e