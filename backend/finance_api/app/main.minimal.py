from fastapi import FastAPI #pip install fastapi uvicorn[standard]

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from finance_api"}


###### ARCHIV FÜR FRÜHERE VERSIONEN - NICHT LÖSCHEN ######

import requests
@app.get('/fmp/{symbol}')
def fmp(symbol: str):
    """
    Diese Route ruft Kursdaten von der Financial Modeling Prep API ab.  
    Beispiel: http://localhost:5000/fmp/AAPL
    Der Symbol wird aus der URL entnommen und an die API übergeben.  
    Die API-Antwort wird als JSON zurückgegeben.
    beispielhafte API-Antwort:
    [
        {
            "symbol": "AAPL",
            "name": "Apple Inc.",
            "price": 172.99
        }
    ]
    """

    api_key = 'B81k3WDoIG15kMJBfNADpbpelWd8ZAJC'
    url = f"https://financialmodelingprep.com/stable/quote?symbol={symbol}&apikey={api_key}"

    try:
        response = requests.get(url)
        response.raise_for_status()  # wirft Fehler bei HTTP 4xx/5xx
        data = response.json() # parse JSON response
        logging.info(f"✅ Kursdaten erfolgreich abgerufen: {data}")
        return JSONResponse(content=data)
    
    except requests.exceptions.HTTPError as http_err:
        logging.info(f"❌ HTTP-Fehler: {http_err}")
    except requests.exceptions.RequestException as req_err:
        logging.info(f"❌ Verbindungsfehler: {req_err}")
    except ValueError as json_err:
        logging.info(f"❌ Fehler beim Parsen der JSON-Daten: {json_err}")
    return JSONResponse(content=None)
