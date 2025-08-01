import os
import cv2
import torch
import pickle
import numpy as np
import pandas as pd
from fashion_clip.fashion_clip import FashionCLIP
from insightface.app import FaceAnalysis
from django.conf import settings
import logging

# --- Setup logging ---
logger = logging.getLogger(__name__)
logger.info("Initializing AI models...")

# --- Initialize AI Models ---
try:
    # Using CPUExecutionProvider for broader compatibility.
    face_app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
    face_app.prepare(ctx_id=0)
    fclip_model = FashionCLIP("fashion-clip")
    logger.info("✅ AI models initialized successfully.")
except Exception as e:
    logger.error(f"❌ Failed to initialize AI models: {e}", exc_info=True)
    face_app = None
    fclip_model = None

# --- Load Product Metadata ---
logger.info("Loading product metadata from CSVs...")
try:
    # --- CORRECTED FILE PATHS ---
    # Build absolute paths from the Django project's base directory.
    # This is the key fix for your 'Product metadata is not available' error.
    styles_path = os.path.join(settings.BASE_DIR, "dataset", "styles.csv")
    prices_path = os.path.join(settings.BASE_DIR, "dataset", "clothing_prices.csv")

    # Check if files exist before trying to read them
    if not os.path.exists(styles_path):
        raise FileNotFoundError(f"styles.csv not found at: {styles_path}")
    if not os.path.exists(prices_path):
        raise FileNotFoundError(f"clothing_prices.csv not found at: {prices_path}")

    styles_df = pd.read_csv(styles_path, on_bad_lines="skip")
    prices_df = pd.read_csv(prices_path)

    # Merge dataframes and prepare them for use
    metadata_df = pd.merge(styles_df, prices_df, on="id", how="left")
    metadata_df["price_inr"].fillna(999.0, inplace=True)
    metadata_df.set_index("id", inplace=True)
    logger.info("✅ Product metadata loaded successfully.")
except Exception as e:
    logger.error(f"❌ Failed to load product metadata CSVs: {e}", exc_info=True)
    metadata_df = None # This line caused the error when the above try block failed


def apply_clahe(image_bgr):
    """Enhances image contrast for better feature detection."""
    lab = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    limg = cv2.merge((cl, a, b))
    return cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)


def detect_skin_tone(image_bgr):
    """Detects the skin tone from facial landmarks."""
    if not face_app: return None
    image = apply_clahe(image_bgr)
    faces = face_app.get(image)
    if not faces: return None

    face = max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
    landmarks = face.landmark_2d_106
    # Sample points from cheeks, forehead, chin for a robust skin tone average
    sample_indices = [54, 76, 82, 46, 34, 72, 66, 40, 28, 88, 20, 23, 25]
    patches = [
        image[int(y) - 10 : int(y) + 10, int(x) - 10 : int(x) + 10]
        for x, y in [landmarks[idx] for idx in sample_indices]
    ]
    patches = [p for p in patches if p.shape[:2] == (20, 20)]
    if not patches: return None

    all_pixels = np.vstack([p.reshape(-1, 3) for p in patches])
    # Filter out pixels that are too dark or too bright (specular highlights)
    valid_pixels = [px for px in all_pixels if np.all(30 < px) and np.all(px < 240)]
    if not valid_pixels: return None

    mean_bgr = np.mean(valid_pixels, axis=0).astype(np.uint8)
    hsv_pixel = cv2.cvtColor(np.uint8([[mean_bgr]]), cv2.COLOR_BGR2HSV)[0][0]
    value = hsv_pixel[2] # Brightness value

    if value > 200: return "very fair"
    elif 160 < value <= 200: return "fair"
    elif 120 < value <= 160: return "medium"
    else: return "dark"


def get_age_gender(image_bgr):
    """Extracts age and gender from the largest face in the image."""
    if not face_app: return None, None
    faces = face_app.get(image_bgr)
    if not faces: return None, None

    face = max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
    age = int(face.age)
    gender = "Female" if face.gender == 0 else "Male"
    return age, gender


def infer_age_group(age):
    """Categorizes an integer age into a descriptive group."""
    if age < 13: return "child"
    elif age < 20: return "teen"
    elif age < 40: return "adult"
    else: return "senior"


def recommend_outfit(prompt, features, catalog, top_k=25):
    """Finds top_k matching items based on a text prompt."""
    if not fclip_model: return []
    text_features = fclip_model.encode_text([prompt], batch_size=1)
    image_features = torch.tensor(features, dtype=torch.float32)
    
    # Calculate cosine similarity
    similarity_scores = image_features @ text_features[0].T
    top_indices = torch.topk(similarity_scores, k=top_k).indices
    
    return [catalog[i]["image"] for i in top_indices]


def get_recommendations(uploaded_file, season, usage):
    """Main function to process an image and return outfit recommendations."""
    if not face_app or not fclip_model:
        raise ValueError("AI models are not available.")
    if metadata_df is None:
        # This error is now unlikely to happen with the corrected paths
        raise ValueError("Product metadata is not available. Check server logs for loading errors.")

    try:
        image_bytes = uploaded_file.read()
        image_np = np.frombuffer(image_bytes, np.uint8)
        image_bgr = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

        skin_tone = detect_skin_tone(image_bgr)
        age, gender = get_age_gender(image_bgr)

        if not all([skin_tone, age, gender]):
            raise ValueError("Could not detect face or its features clearly. Please try another photo.")

        age_group = infer_age_group(age)
        prompt = f"{usage} outfit for a {age_group} {gender.lower()} with {skin_tone} skin tone for the {season} season"
        logger.info(f"Generated Prompt: {prompt}")

        # Load cached image features and catalog data
        features_path = os.path.join(settings.BASE_DIR, "stylist_app", "pkl", "cached_image_features.pkl")
        catalog_path = os.path.join(settings.BASE_DIR, "stylist_app", "pkl", "cached_catalog.pkl")

        with open(features_path, "rb") as f:
            features = pickle.load(f)
        with open(catalog_path, "rb") as f:
            catalog = pickle.load(f)

        outfit_paths = recommend_outfit(prompt, features, catalog, top_k=25)

        results = []
        for path in outfit_paths:
            try:
                # Extract the product ID from the image filename
                image_id = int(os.path.basename(path).split(".")[0])
                product_details = metadata_df.loc[image_id]
                results.append(
                    {
                        "id": image_id,
                        "productDisplayName": product_details["productDisplayName"],
                        "price_inr": product_details["price_inr"],
                        "image": os.path.basename(path),
                    }
                )
            except (KeyError, ValueError):
                # Safely skip items that are recommended but not in the metadata
                logger.warning(f"Could not find metadata for recommended image ID: {os.path.basename(path)}")
                continue

        return {"recommendations": results}

    except Exception as e:
        logger.error(f"An unexpected error occurred in get_recommendations: {e}", exc_info=True)
        # Re-raise the exception to let Django's error handling create a 500 response
        raise e