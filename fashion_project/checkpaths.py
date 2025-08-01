# check_paths.py
import pickle
import os

try:
    # This path assumes you run the script from the project root directory
    catalog_path = os.path.join('stylist_app', 'pkl', 'cached_catalog.pkl')

    with open(catalog_path, 'rb') as f:
        catalog = pickle.load(f)

    if catalog and isinstance(catalog, list) and 'image' in catalog[0]:
        first_image_path = catalog[0]['image']
        print("\n--- Path Analysis ---")
        print(f"✅ Successfully loaded the catalog file.")
        print(f"\nThe application is looking for images using a path like this:")
        print(f"➡️   {first_image_path}")
        print("\n---------------------\n")

        # Provide actionable advice
        if os.path.isabs(first_image_path):
            print("This is an ABSOLUTE path. You MUST place your dataset at this exact location on your computer.")
        else:
            print("This is a RELATIVE path. Based on this, your 'images' folder should be placed in the project's root directory.")

    else:
        print("❌ Error: The catalog file is not in the expected format.")
        print("It should be a list of dictionaries, with each dictionary having an 'image' key.")

except FileNotFoundError:
    print(f"❌ Error: Could not find the file at '{catalog_path}'.")
    print("Please ensure 'cached_catalog.pkl' is inside the 'stylist_app/pkl/' directory.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")