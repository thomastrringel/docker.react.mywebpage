"""
myFastAPIServer.py
A simple FastAPI server that connects to a MariaDB database and provides an API endpoint to fetch   
!!! ACHTE DARAUF DASS ALLE IMPORTS AUCH IM DOCKERFILE.PYTHON STEHEN

Dieses Skript erstellt einen einfachen FastAPI-Webserver, der mit einer MariaDB-Datenbank verbunden ist.
Der Server bietet verschiedene API-Endpunkte, um Daten abzurufen und zu verarbeiten.
Du kannst den Server starten, indem du dieses Skript ausführst:
    python myFastApiServer.py
Der Server läuft dann auf http://localhost:5000 (oder einer anderen IP/Port, je nach Konfiguration).

Voraussetzungen:
- Python 3.x
- fastapi
- uvicorn[standard]
- mariadb
- yfinance
- plotly
- requests
- json

    data = {
        "name": "Thomas",
        "skills": ["Python", "JavaScript", "Docker"]
    }
    return JSONResponse(content=data)

Der Grund liegt in der Unterscheidung zwischen Python-Datenstrukturen und HTTP-kompatiblem JSON-Response.
In Python ist data = {"name": "Thomas"} ein Dictionary, nicht direkt ein JSON-Objekt. FastAPI serialisiert Python-Objekte automatisch (oder du kannst JSONResponse verwenden).

Standardmäßig verfügbar (bei deinem Server auf Port 5000):
Swagger‑UI: http://localhost:5000/docs
ReDoc: http://localhost:5000/redoc
OpenAPI‑Spec (JSON): http://localhost:5000/openapi.json

cors
allow_origins: Eine Liste von Ursprüngen (Domains), die Zugriff auf die API haben dürfen. Du kannst "*" verwenden, um alle Ursprünge zu erlauben (nicht empfohlen in der Produktion).
allow_credentials: Gibt an, ob Cookies und andere Anmeldeinformationen in CORS-Anfragen erlaubt sind.
allow_methods: Eine Liste von HTTP-Methoden, die erlaubt sind (z. B. ["GET", "POST"]). "*" erlaubt alle Methoden.
allow_headers: Eine Liste von Headern, die erlaubt sind. "*" erlaubt alle Header.

implemented routes:
/fmp/{symbol}           -> Financial Modeling Prep API Daten abrufen
/readsql                -> SQL Query aus URL-Parameter ausführen und Ergebnis zurückgeben
/addSymbol              -> Symbol in MariaDB-Tabelle SYMBOLS einfügen
/removeSymbol           -> Symbol aus MariaDB-Tabelle SYMBOLS entfernen
/getInvest              -> Invest-Daten aus MariaDB abrufen und als JSON zurückgeben
/getPlotlyhtml          -> Plotly-Grafik als HTML rendern und zurückgeben
/checkfastapi           -> Prüfen, ob FastAPI läuft
/weather                -> Wetterdaten von OpenWeatherMap abrufen
/matplotlib             -> Matplotlib-Grafik in HTML rendern und zurückgeben
/                       -> Startseite mit Tabellennamen aus MariaDB rendern
/yfinance/stock/{symbol} -> Aktienkursdaten von yfinance abrufen


"""

import os

# Lese den Port aus der Umgebungsvariable, mit 5000 als Standardwert, falls sie nicht gesetzt ist.
APP_PORT = int(os.getenv("APP_PORT", 5000))


# FastAPI Imports 
from fastapi import FastAPI, Request, APIRouter, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware

# für /readsql und /getInvest
import mariadb

# für /getInvest
from datetime import datetime

# für /yfinance/stock/<symbol>
import yfinance as yf

# für /getPlotlyhtml
import plotly.graph_objects as go # pip install plotly

# für /fmp/<symbol>
import requests

# für /getInvest
import json

# für Zeitkonvertierung in /getInvest
import pytz

# für Logging
import logging
logging.basicConfig(level=logging.INFO)

# Erstelle die FastAPI-App
app = FastAPI()
# CORS-Konfiguration Liste der erlaubten Ursprünge
origins = [
    "http://localhost",
    "http://localhost:8080",  # Beispiel: Frontend auf einem anderen Port
    "http://127.0.0.1:8080",
]
# Enable CORS für FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # = origins   Liste der erlaubten Ursprünge
    allow_credentials=True,   # Cookies und Anmeldedaten erlauben
    allow_methods=["*"],    # Alle HTTP-Methoden erlauben
    allow_headers=["*"],    # Alle Header erlauben
)


#
# INTERNE FUNKTIONEN
#

def get_MariaDB_data(sql_query="SHOW TABLES"):
    """
    Diese Funktion stellt eine Verbindung zur MySQL-Datenbank her und führt den übergebenen SQL-Query aus.
    Per Default gibt sie alle Tabellen in der Datenbank zurück (SHOW TABLES).
    Sie behandelt auch mögliche Fehler, die bei der Verbindung oder Abfrage auftreten können.
    gibt ein Array von Objekten mit den Schlüsseln zurück:

        Abfrageergebnis:
    [
        [2, "INDEX", "^DJI"],
        [9, "0941.HK", "0941.HK"],
        ...
    ]

    Zielstruktur
    [
        { id: 2, name: "INDEX", symbol: "^DJI" },
        { id: 9, name: "0941.HK", symbol: "0941.HK" },
        ...
    ]

    Die Funktion konvertiert die Ergebnismenge in eine Liste von Dictionaries,
    wobei die Spaltennamen als Schlüssel verwendet werden.
    Die Fnktion ist rein intern und wird von den Routen /readsql und /getInvest aufgerufen.
    Daher wird kein JSONResponse hier verwendet und ein reines Python-Objekt zurückgegeben.

    """
    try:
        conn = mariadb.connect(
            host="192.168.178.20",
            user="admin",
            password="",
            database="test",
            port=3306
        )
        logging.info("✅ Verbindung zur Datenbank erfolgreich!")
        cursor = conn.cursor()
        cursor.execute(sql_query)
        rows = cursor.fetchall()

        # Konvertiere die Ergebnismenge in eine Liste von Dictionaries
        columns = [desc[0] for desc in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]

        cursor.close()
        conn.close()

        logging.info("✅ Abfrage erfolgreich ausgeführt!")
        logging.info(result)
        logging.info(f"Anzahl der zurückgegebenen Zeilen: {len(result)}")

        return result

    except mariadb.Error as e:
        logging.info(f"❗ Fehler: {e}")
        logging.info(f"🔢 Fehlercode: {getattr(e,'errno',None)}, SQLSTATE: {getattr(e,'sqlstate',None)}")

        # Rückgabe als Python-Dict (keine FastAPI-Response)
        if getattr(e, "errno", None) == 1045:
            return {"error": "Zugriff verweigert – falscher Benutzername oder Passwort"}
        elif getattr(e, "errno", None) == 1049:
            return {"error": "Datenbank nicht gefunden"}
        elif getattr(e, "errno", None) == 2003:
            return {"error": "Keine Verbindung zum Server möglich"}
        else:
            return {"error": f"Unbekannter Fehler ({getattr(e,'errno',None)}): {str(e)}"}
 

def convert_timestamp_to_local(timestamp):
    # Beispiel-Timestamp (Unix-Zeit in Sekunden)
    # timestamp = 1609459200  # Entspricht 2021-01-01 00:00:00 UTC
    # Konvertierung in ein lesbares Datum in der lokalen Zeitzone   
    tz = pytz.timezone('Europe/Berlin')
    readable_date_local = datetime.fromtimestamp(timestamp, tz).strftime('%Y-%m-%d %H:%M:%S')
    print(readable_date_local)


def convert_timestamp_to_local(timestamp):
    # Beispiel-Timestamp (Unix-Zeit in Sekunden)
    # timestamp = 1609459200  # Entspricht 2021-01-01 00:00:00 UTC
    # Konvertierung in ein lesbares Datum in der lokalen Zeitzone   
    tz = pytz.timezone('Europe/Berlin')
    readable_date_local = datetime.fromtimestamp(timestamp, tz).strftime('%Y-%m-%d %H:%M:%S')
    print(readable_date_local)


#
# ROUTES (FastAPI)
#
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


@app.get('/readsql')
def readsql(request: Request):
    """
    # Diese Route liest einen SQL-Query aus den URL-Parametern und führt ihn in der MariaDB-Datenbank aus.
    # Beispiel: http://localhost:5000/readsql?query=SHOW%20TABLES
    # Der Query wird über die URL-Parameter übergeben und an die Funktion get_MariaDB_test weitergeleitet.  
    # Das Ergebnis der Abfrage wird als JSON zurückgegeben.
    # 
    # Wichtig: In einer echten Anwendung solltest du SQL-Injection verhindern, indem du nur vordefinierte Queries zulässt oder Parameter sicher bindest.
    # Hier wird der Query direkt ausgeführt, was unsicher sein kann.
    """
    sql_query = request.query_params.get('query')
    if not sql_query:
        return PlainTextResponse("Fehlender SQL-Query", status_code=400)
    
    logging.info(f"SQL-Abfrage erhalten: {sql_query}")
    result = get_MariaDB_data(sql_query)

    # result ist jetzt ein Python-Objekt -> serialisiere hier
    return JSONResponse(content=result)


@app.get('/addSymbol')
def addSymbol(symbol: str):
    """
    Diese Route fügt einen neuen Symbol in die Tabelle SYMBOLS in der MariaDB-Datenbank ein.
    Beispiel: http://localhost:5000/addSymbol?symbol=AAPL
    Der Symbol wird aus den URL-Parametern entnommen und in die Datenbank eingefügt.
    Die API-Antwort wird als JSON zurückgegeben.
    """
    sql_query = f"INSERT INTO SYMBOLS (symbol) VALUES ('{symbol}')"
    logging.info(f"SQL-Abfrage zum Einfügen erhalten: {sql_query}")
    result = get_MariaDB_data(sql_query)

    # result ist jetzt ein Python-Objekt -> serialisiere hier
    return JSONResponse(content=result) 

@app.get('/removeSymbol')
def removeSymbol(symbol: str):
    """
    Diese Route entfernt einen Symbol aus der Tabelle SYMBOLS in der MariaDB-Datenbank.
    Beispiel: http://localhost:5000/removeSymbol?symbol=AAPL
    Der Symbol wird aus den URL-Parametern entnommen und aus der Datenbank entfernt.
    Die API-Antwort wird als JSON zurückgegeben.
    """
    sql_query = f"DELETE FROM SYMBOLS WHERE symbol = '{symbol}'"
    logging.info(f"SQL-Abfrage zum Entfernen erhalten: {sql_query}")
    result = get_MariaDB_data(sql_query)

    # result ist jetzt ein Python-Objekt -> serialisiere hier
    return JSONResponse(content=result)     


@app.get('/getInvest')
def getInvest():
    """
    Diese Route liest alle Daten aus der Tabelle INVEST in der MariaDB-Datenbank.
    Die Daten werden als JSON zurückgegeben.

    """
    
    result = get_MariaDB_data("SELECT * FROM INVEST")

    # result ist bereits ein Python-Objekt (Liste oder dict bei Fehler)
    json_data = result
    logging.info(f"json_data INVEST-Daten: {json_data}")

    if isinstance(json_data, dict) and "error" in json_data:
        return JSONResponse(content=json_data, status_code=500)
    
    anzahl_datensaetze = len(json_data)
    logging.info(f"Anzahl Datensätze: {anzahl_datensaetze}")
    logging.info(f"Datensatz 1: {json_data[0]}")

    # Extrahiere die Spaltenwerte in separate Listen
    ausgaben = [row["SUMME_AUSGABEN"] for row in json_data]
    einnahmen = [row["SUMME_EINNAHMEN"] for row in json_data]

    # Datum parsen und formatieren
    # Datum parsen und formatieren: akzeptiere sowohl str als auch datetime
    datum = []
    for row in json_data:
        raw = row.get("DATUM")
        if isinstance(raw, str):
            try:
                parsed = datetime.strptime(raw, "%a, %d %b %Y %H:%M:%S GMT")
            except Exception:
                try:
                    parsed = datetime.fromisoformat(raw)
                except Exception:
                    parsed = None
        elif isinstance(raw, datetime):
            parsed = raw
        else:
            parsed = None
        datum.append(parsed)

    datum_strings = [d.strftime("%Y-%m-%d") if isinstance(d, datetime) else "" for d in datum]
    # datum = [datetime.strptime(row["DATUM"], "%a, %d %b %Y %H:%M:%S GMT") for row in json_data]
    # datum_strings = [d.strftime("%Y-%m-%d") for d in datum]

    # Optional: GuV berechnen, falls du sie brauchst
    delta = [row.get("GuV") for row in json_data]

    logging.info(f"Alle Werte der ersten Spalte: {datum_strings}")

    return JSONResponse(content={
        "x": datum_strings,
        "a": ausgaben,
        "e": einnahmen
    })
    

@app.get('/getPlotlyhtml', response_class=HTMLResponse)
def getPlotlyhtml(symbol: str = "AAPL", min: float = 200, max: float = 230, today: float = 220, reference: float = 210, redline: float = 225):
    # Beispiel: http://localhost:5000/getPlotlyhtml?symbol=AAPL&min=200&max=230&today=220&reference=210&redline=225
    # Werte aus Query-Parametern lesen, ggf. mit Default-Werten
    symbol = symbol
    value52WeekMin = float(min)
    value52WeekMax = float(max)
    valueToday = float(today)
    valueReference = float(reference)
    valueRedLine = float(redline)    

    # Berechne die Bereiche für Rot und Grün
    value52WeekMinRed = value52WeekMin * 1.10 # 10% über dem Minimum
    value52WeekMaxGreen = value52WeekMax * 0.90 # 10% unter dem Maximum
    if value52WeekMinRed > value52WeekMaxGreen:
        # Überschneidung vermeiden
        value52WeekMinRed = value52WeekMaxGreen 

    if value52WeekMaxGreen < value52WeekMinRed:
        # Überschneidung vermeiden
        value52WeekMaxGreen = value52WeekMinRed 

    # Erstelle eine Plotly-Grafik
    # https://plotly.com/python/gauge-charts/
    fig = go.Figure(go.Indicator(
        mode = "number+gauge+delta", value = valueToday,
        domain = {'x': [0.1, 1], 'y': [0, 1]},
        # title = {'text' : f"<b>{symbol}</b>"},
        delta = {'reference': valueReference},
        gauge = {
            'shape': "bullet",
            'axis': {'range': [value52WeekMin, value52WeekMax]},
            'bar': {'color': 'black'},  # <--- Das ist der Fortschrittsbalken!
            'threshold': {
                'line': {'color': "black", 'width': 4},
                'thickness': 0.75,
                'value': valueRedLine},
            'steps': [
                {'range': [value52WeekMin, value52WeekMinRed], 'color': "red"},
                {'range': [value52WeekMaxGreen, value52WeekMax], 'color': "green"}]}))
    fig.update_layout(height = 250)
    fig.update_layout(title_text=f"{symbol} 52w Low/High & Today & 200dayavg", title_x=0.5, title_y=0.98, title_font=dict(size=20))

    # fig.show()

    html_content = fig.to_html(full_html=True)
    
    return HTMLResponse(content=html_content)


@app.get('/')
def index(request: Request):
    """
    # Das ist ein sogenannter Decorator in Python – und in FastAPI bedeutet er:
    # „Wenn jemand die URL / aufruft, führe die Funktion index() aus.“
    # @app.get(...)
    # Wird verwendet, wenn du direkt auf dem FastAPI-Hauptobjekt (app = FastAPI()) 
    # Routen definierst. Das ist typisch für kleine oder einfache Anwendungen.

    """
    
    # Rufe die Funktion get_MariaDB_data auf, um die Tabellennamen abzurufen
    result = get_MariaDB_data()

    # Daten sind im JSON Format (als Python-Objekt)
    logging.info(f"json_data Tabellendaten: {result}")

    if isinstance(result, dict) and "error" in result:
        # Bei einem Fehler die Fehlermeldung an das Template übergeben
        # return templates.TemplateResponse("index.html", {"request": request, "daten": [], "error": result["error"], "year": datetime.now().year, "ISIN": "1234567890"})
        return {
            "status": "nok", 
            "message": "Finance API not running",
            "error": result["error"],
            "tabellen": []
        }
    # Extrahiere die Tabellennamen aus den Daten
    tabellen = [row['Tables_in_test'] for row in result]

    # Rendere das Template index.html und übergebe die Tabellennamen
    # return templates.TemplateResponse("index.html", {"request": request, "daten": tabellen, "year": datetime.now().year, "ISIN": "1234567890"})
    return {
        "status": "ok", 
        "message": "Finance API running",
        "tabellen": tabellen
    }

@app.get('/checkfastapi')
def checkfastapi():
    return PlainTextResponse("✅ FastAPI ist installiert und läuft!")    


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



# ... andere Imports
import base64
import io
import matplotlib.pyplot as plt
from matplotlib.figure import Figure
@app.get("/matplotlib", response_class=HTMLResponse)
def show_plot_in_html(request: Request):
    """
    Erzeugt eine Matplotlib-Grafik, kodiert sie als Base64 und
    bettet sie in eine HTML-Seite ein, die über ein Template gerendert wird.
    
    Das request-Objekt enthält alle Informationen über die eingehende HTTP-Anfrage, die der Browser an deinen Server gesendet hat. Dazu gehören:
        Die URL (request.url)
        HTTP-Header (request.headers)
        Die IP-Adresse des Clients (request.client.host)
        Query-Parameter und Cookies
    """

    # return PlainTextResponse("matplotlib endpoint available")    
    
    # 1. Grafik erstellen (wie in Methode 1)
    fig = Figure(figsize=(6, 4), dpi=100)
    ax = fig.add_subplot(1, 1, 1)
    ax.set_title("Eingebettete Matplotlib-Grafik")
    ax.plot([1, 2, 3, 4], [10, 20, 5, 15])
    ax.grid(True)

    # return PlainTextResponse("matplotlib grafik available")    

    # 2. Grafik in Puffer speichern
    buf = io.BytesIO()
    fig.savefig(buf, format="png")
    buf.seek(0)

    # return PlainTextResponse("matplotlib grafikbuffer available")    

    # 3. Bilddaten als Base64-String kodieren
    image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    image_url = f"data:image/png;base64,{image_base64}"

    # return PlainTextResponse("matplotlib base64 string available")    

    # 4. Template rendern und die Bild-URL übergeben
    # Du müsstest eine entsprechende HTML-Datei (z.B. plot.html) im "templates"-Ordner haben.
    return HTMLResponse(f"<img src='{image_url}' />")



# This module defines a Router for handling financial data requests using yfinance.    
# It provides an endpoint to fetch stock information based on a given symbol.
# The endpoint returns JSON data including current price, currency, P/E ratio, and market cap.
# It assumes that yfinance is installed in the environment.
# Usage: Register this router in the main FastAPI application to enable the route.
# Example: app.include_router(finance_router)
# Ensure to handle exceptions and errors in a production environment.
# Required packages: yfinance
# pip install yfinance
# http://localhost:5000/api/stock/AAPL Aktienkurse abrufen – und z. B. im Apache-Frontend einbinden

# Defining a Router for financial routes (ersetzt Blueprint)
finance_router = APIRouter()

@finance_router.get('/yfinance/getstockfulldata/{symbol}')
def getstockfulldata(symbol: str):
    """
    Diese Route verwendet yfinance, um Aktieninformationen für ein gegebenes Symbol abzurufen.
    Beispiel: http://localhost:5000/api/stock/AAPL
    Der Symbol wird aus der URL entnommen und an yfinance übergeben.
    Die API-Antwort wird als JSON zurückgegeben.
    """
    ticker = yf.Ticker(symbol.upper())
    info = ticker.info

    return JSONResponse(content=info)


@finance_router.get('/yfinance/stock/{symbol}')
def get_stock_data(symbol: str):
    """
    Diese Route verwendet yfinance, um Aktieninformationen für ein gegebenes Symbol abzurufen.
    Beispiel: http://localhost:5000/api/stock/AAPL
    Der Symbol wird aus der URL entnommen und an yfinance übergeben.
    Die API-Antwort wird als JSON zurückgegeben.
    """
    ticker = yf.Ticker(symbol.upper())
    info = ticker.info

    # aussortieren der gewünschten Informationen
    quoteType = info.get('quoteType', 'INVALID') # US, DE, INDEX, ETF, FUTURE
    symbol = info.get('symbol', 'N/A') # US, DE, INDEX, ETF, FUTURE
    name = info.get('shortName', 'N/A') # US, DE, INDEX, ETF, FUTURE
    # longName = info.get('longName', 'N/A') # US, DE, INDEX, ETF, -FUTURE
    # country = info.get('country', 'N/A') # US, DE, -INDEX, -ETF, -FUTURE
    # industry = info.get('industry', 'N/A') # US, DE, -INDEX, -ETF, -FUTURE
    region = info.get('region', 'N/A') # US, DE, INDEX, ETF, FUTURE
    # sector = info.get('sector', 'N/A') # US, DE, -INDEX, -ETF, -FUTURE

    currency = info.get('currency', 'N/A') # US, DE, INDEX, ETF, FUTURE

    # Hilfsfunktion zur sicheren Formatierung von Zahlen
    def format_value(value, precision=2):
        if isinstance(value, (int, float)):
            return f"{value:.{precision}f}"
        return 'N/A'

    # Numerische Werte abrufen und formatieren
    regular_market_price = format_value(info.get('regularMarketPrice'))
    previous_close = format_value(info.get('previousClose'))
    fifty_two_week_low = format_value(info.get('fiftyTwoWeekLow'))
    fifty_two_week_high = format_value(info.get('fiftyTwoWeekHigh'))
    priceToBook = format_value(info.get('priceToBook'))
    fiftyDayAverage = format_value(info.get('fiftyDayAverage'))
    twoHundredDayAverage = format_value(info.get('twoHundredDayAverage'))
    fiveYearAvgDividendYield = format_value(info.get('fiveYearAvgDividendYield'))

    # Erstelle das Ergebnis-Dictionary
    result = {
        'quoteType': quoteType,
        'symbol': symbol,
        'name': name,
        'region': region,
        'currency': currency,
        'regularMarketPrice': regular_market_price,
        'previousClose': previous_close,
        'fiftyTwoWeekLow': fifty_two_week_low,
        'fiftyTwoWeekHigh': fifty_two_week_high,
        'priceToBook': priceToBook,
        'fiftyDayAverage': fiftyDayAverage,
        'twoHundredDayAverage': twoHundredDayAverage,
        'fiveYearAvgDividendYield': fiveYearAvgDividendYield
    }

    # Alle Schlüssel-Werte-Paare als Response zurückgeben
    return JSONResponse(content=result)
    # Wenn man nur bestimmte Werte zurückgeben möchte, z. B.:
    # return JSONResponse(content={
    #     'symbol': symbol.upper(),
    #     'price': info.get('currentPrice'),
    #     'currency': info.get('currency'),
    #     'peRatio': info.get('trailingPE'),
    #     'marketCap': info.get('marketCap')
    # })

# Router in der Haupt-App registrieren
app.include_router(finance_router)


# In Python hat jedes Skript eine spezielle Variable namens __name__.
# Wenn das Skript direkt ausgeführt wird (z. B. mit python myFastApiServer.py), dann ist __name__ gleich '__main__'.
# Ist das Skript importiert (z. B. als Modul), dann hat __name__ den Namen der Datei (z. B. 'app').
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=APP_PORT)
