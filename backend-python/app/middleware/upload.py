import os
import time
import random
from werkzeug.utils import secure_filename
from app.config import Config

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file_storage):
    """
    Saves an uploaded file to images/ using the same naming scheme as multer:
    `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    """
    if not file_storage or not file_storage.filename:
        return None

    if not file_storage.mimetype.startswith('image/'):
        raise ValueError("Only image files are allowed")

    upload_dir = Config.UPLOAD_FOLDER
    os.makedirs(upload_dir, exist_ok=True)

    _, ext = os.path.splitext(file_storage.filename)
    timestamp = int(time.time() * 1000)
    rand = random.randint(100000000, 999999999)
    filename = f"{timestamp}-{rand}{ext.lower()}"

    save_path = os.path.join(upload_dir, filename)
    file_storage.save(save_path)
    return filename
