from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import uvicorn
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
import os
import shutil
import pickle
import pandas as pd

app = FastAPI()

# ==============================
# LOAD IMAGE CLASSIFICATION MODEL
# ==============================

MODEL_PATH = "waste_model.weights.h5"
DATASET_PATH = "../dataset"

class_names = sorted(os.listdir(DATASET_PATH))

base_model = MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)

base_model.trainable = False

model = models.Sequential([
    layers.Rescaling(1./255),
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(30, activation='softmax')
])

model.build((None, 224, 224, 3))
model.load_weights(MODEL_PATH)

print("Image classification model loaded.")

# ==============================
# LOAD PRICE PREDICTION MODEL
# ==============================

with open("price_model.pkl", "rb") as f:
    price_model = pickle.load(f)

print("Price prediction model loaded.")

# ==============================
# IMAGE PREDICTION FUNCTION
# ==============================

def predict_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)
    predicted_class = class_names[np.argmax(predictions)]

    return predicted_class

# ==============================
# IMAGE CLASSIFICATION ENDPOINT
# ==============================

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    temp_path = "temp_image.jpg"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    prediction = predict_image(temp_path)

    os.remove(temp_path)

    return {"predicted_class": prediction}

# ==============================
# PRICE PREDICTION ENDPOINT
# ==============================

class PriceRequest(BaseModel):
    item: str
    condition: str
    weight_kg: float

@app.post("/predict-price")
async def predict_price(request: PriceRequest):
    try:
        input_data = pd.DataFrame([{
            "item": request.item,
            "condition": request.condition,
            "weight_kg": request.weight_kg
        }])

        predicted_price = price_model.predict(input_data)[0]

        return {
            "predicted_price": round(float(predicted_price), 2)
        }

    except Exception as e:
        return {"error": str(e)}

# ==============================

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)