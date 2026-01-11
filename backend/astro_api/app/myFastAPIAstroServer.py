from fastapi import FastAPI, requests, HTTPException # pip install fastapi uvicorn[standard]
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.responses import PlainTextResponse

import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from astro_api"}


from fastapi.responses import PlainTextResponse
@app.get('/checkfastapi')
def checkfastapi():
    return PlainTextResponse("✅ FastAPI ASTRO ist installiert und läuft!")    



@app.get("/weather")
def get_weather(lat: float = 48.776, lon: float = 9.130):
    """
    Ruft Wetterdaten von OpenWeatherMap ab.
    Der API-Schlüssel wird sicher aus einer Umgebungsvariable gelesen.
    """
    api_key = os.getenv("OPENWEATHERMAP_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OpenWeatherMap API Key ist nicht auf dem Server konfiguriert.")

    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric&lang=de"
    
    response = requests.get(url)
    response.raise_for_status()  # Wirft eine Exception bei Fehlern (z.B. 404, 500)
    return response.json()
