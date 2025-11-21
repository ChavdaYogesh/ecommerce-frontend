import os
from PIL import Image

def optimize_assets(directory="assets"):
    if not os.path.exists(directory):
        print(f"Directory '{directory}' not found. Creating it...")
        os.makedirs(directory)
        return

    for filename in os.listdir(directory):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            filepath = os.path.join(directory, filename)
            
            try:
                with Image.open(filepath) as img:
                    # 1. Resize if massive (e.g., > 1920px)
                    if img.width > 1920:
                        ratio = 1920 / img.width
                        new_height = int(img.height * ratio)
                        img = img.resize((1920, new_height), Image.Resampling.LANCZOS)

                    # 2. Save as WebP (Modern Format)
                    new_filename = os.path.splitext(filename)[0] + '.webp'
                    new_filepath = os.path.join(directory, new_filename)
                    
                    img.save(new_filepath, 'webp', quality=80, optimize=True)
                    
                    print(f"✅ Optimized: {filename} -> {new_filename}")
                    
                    # Optional: Remove original
                    # os.remove(filepath) 

            except Exception as e:
                print(f"❌ Error optimizing {filename}: {e}")

if __name__ == "__main__":
    print("🚀 Starting Asset Optimization...")
    optimize_assets()
    print("✨ Done!")