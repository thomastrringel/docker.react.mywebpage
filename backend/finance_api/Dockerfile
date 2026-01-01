FROM python:3.11-slim

WORKDIR /app

# Systempakete installieren, die für mariadb benötigt werden
RUN apt-get update && \
    apt-get install -y default-libmysqlclient-dev gcc && \
    apt-get clean

# Anwendungscode kopieren und Abhängigkeiten installieren    
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

CMD ["uvicorn", "app.myFastAPIFinancialServer:app", "--host", "0.0.0.0", "--port", "8000"]
