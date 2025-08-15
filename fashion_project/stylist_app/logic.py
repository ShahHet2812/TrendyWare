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
from PIL import Image
import io

logger = logging.getLogger(__name__)
logger.info("Initializing AI models...")

# --- Model and Metadata Loading (No Changes) ---
try:
    face_app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
    face_app.prepare(ctx_id=0)
    fclip_model = FashionCLIP("fashion-clip")
    logger.info("✅ AI models initialized successfully.")
except Exception as e:
    logger.error(f"❌ Failed to initialize AI models: {e}", exc_info=True)
    face_app = None
    fclip_model = None

logger.info("Loading product metadata from CSVs...")
try:
    # Adjusted path to be relative to Django's BASE_DIR for better portability
    styles_path = os.path.join(
        settings.BASE_DIR, "datasets", "myntradataset", "styles.csv"
    )
    prices_path = os.path.join(
        settings.BASE_DIR, "datasets", "myntradataset", "clothing_prices.csv"
    )

    styles_df = pd.read_csv(styles_path, on_bad_lines="skip")
    prices_df = pd.read_csv(prices_path)

    metadata_df = pd.merge(styles_df, prices_df, on="id", how="left")
    metadata_df["price_inr"].fillna(999.0, inplace=True)
    metadata_df.set_index("id", inplace=True)
    logger.info("✅ Product metadata loaded successfully.")
except Exception as e:
    logger.error(f"❌ Failed to load product metadata CSVs: {e}", exc_info=True)
    metadata_df = None


# --- Helper Functions (No Changes) ---
def apply_clahe(image_bgr):
    lab = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    limg = cv2.merge((cl, a, b))
    return cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)


def detect_skin_tone(image_bgr):
    if not face_app:
        return None
    image = apply_clahe(image_bgr)
    faces = face_app.get(image)
    if not faces:
        return None
    face = max(faces, key=lambda f: f.bbox[2] - f.bbox[0])
    landmarks = face.landmark_2d_106
    sample_indices = [54, 76, 82, 46, 34, 72, 66, 40, 28, 88, 20, 23, 25]
    patches = [
        image[
            int(landmarks[idx][1]) - 10 : int(landmarks[idx][1]) + 10,
            int(landmarks[idx][0]) - 10 : int(landmarks[idx][0]) + 10,
        ]
        for idx in sample_indices
    ]
    patches = [p for p in patches if p.shape[:2] == (20, 20)]
    if not patches:
        return None
    all_pixels = np.vstack([p.reshape(-1, 3) for p in patches])
    valid_pixels = [px for px in all_pixels if np.all(30 < px) and np.all(px < 240)]
    if not valid_pixels:
        return None
    mean_bgr = np.mean(valid_pixels, axis=0).astype(np.uint8)
    hsv_pixel = cv2.cvtColor(np.uint8([[mean_bgr]]), cv2.COLOR_BGR2HSV)[0][0]
    v = hsv_pixel[2]
    if v > 200:
        return "very fair"
    elif 160 < v <= 200:
        return "fair"
    elif 120 < v <= 160:
        return "medium"
    else:
        return "dark"


def get_age_gender(image_bgr):
    if not face_app:
        return None, None
    faces = face_app.get(image_bgr)
    if not faces:
        return None, None
    face = max(faces, key=lambda f: f.bbox[2] - f.bbox[0])
    age = int(face.age)
    gender = "Female" if face.gender == 0 else "Male"
    return age, gender


def infer_age_group(age):
    if age < 13:
        return "child"
    elif age < 20:
        return "teen"
    elif age < 40:
        return "adult"
    else:
        return "senior"


# --- CORRECTED RECOMMENDATION LOGIC ---


def get_recommendations(uploaded_file, season, usage):
    if not fclip_model or metadata_df is None:
        raise ValueError("AI models or product metadata are not available.")

    try:
        image_bytes = uploaded_file.read()
        image_pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_bgr = cv2.cvtColor(np.array(image_pil), cv2.COLOR_RGB2BGR)

        # --- Load Cached Data ---
        features_path = os.path.join(
            settings.BASE_DIR, "stylist_app", "pkl", "cached_image_features.pkl"
        )
        catalog_path = os.path.join(
            settings.BASE_DIR, "stylist_app", "pkl", "cached_catalog.pkl"
        )
        with open(features_path, "rb") as f:
            features = pickle.load(f)
        with open(catalog_path, "rb") as f:
            catalog = pickle.load(f)

        catalog_features = torch.tensor(features, dtype=torch.float32)
        top_indices = []

        # --- METHOD 1: Try Face-Based Text-to-Image Search ---
        age, gender = get_age_gender(image_bgr)
        if age is not None and gender is not None:
            skin_tone = detect_skin_tone(image_bgr) or "neutral"
            age_group = infer_age_group(age)
            prompt = f"{usage} outfit for a {age_group} {gender.lower()} with {skin_tone} skin in {season}"
            logger.info(f"SUCCESS: Face detected. Using prompt: '{prompt}'")

            text_features = fclip_model.encode_text([prompt], batch_size=1)
            text_similarity = catalog_features @ text_features[0].T
            top_indices = torch.topk(text_similarity, k=25).indices

        # --- METHOD 2: Fallback to Image-to-Image Similarity ---
        else:
            logger.info(
                "INFO: No face detected. Falling back to image similarity search."
            )
            uploaded_image_features = fclip_model.encode_images(
                [image_pil], batch_size=1
            )
            image_similarity = catalog_features @ uploaded_image_features[0].T
            top_indices = torch.topk(image_similarity, k=25).indices

        # --- Process and Return Results ---
        recommendation_paths = [catalog[i]["image"] for i in top_indices]

        results = []
        for path in recommendation_paths:
            try:
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
                logger.warning(
                    f"Could not find metadata for image ID: {os.path.basename(path)}"
                )
                continue

        return {"recommendations": results}

    except Exception as e:
        logger.error(
            f"An unexpected error occurred in get_recommendations: {e}", exc_info=True
        )
        raise e