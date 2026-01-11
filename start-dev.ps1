# Gibt eine klare Startmeldung aus.
Write-Host "Entwicklungs-Umgebung wird gestartet..." -ForegroundColor Cyan

# Setze die Variable, die angibt, dass wir auf dem Laptop arbeiten.
$env:VITE_HOSTSYSTEM = "LAP"

# Schritt 1: Die korrekte IP-Adresse des Laptops ermitteln und als Umgebungsvariable setzen.
Write-Host "Ermittle Host-IP-Adresse für Docker..."
$env:VITE_HOST_IP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'WLAN' | Select-Object -First 1).IPAddress

# Überprüfen, ob die IP gefunden wurde und sie ausgeben.
if ($env:VITE_HOST_IP) {
    Write-Host "IP-Adresse erfolgreich gefunden: $($env:VITE_HOST_IP)" -ForegroundColor Green
} else {
    Write-Host "FEHLER: Konnte keine IP-Adresse für den Adapter 'WLAN' finden. Bitte Netzwerkverbindung prüfen." -ForegroundColor Red
    # Das Skript mit einem Fehlercode beenden, wenn keine IP gefunden wurde.
    exit 1
}

# Setze die Umgebungsvariable für die FastAPI-URL mit der gefundenen IP-Adresse.
Write-Host "Setze VITE_HOSTSYSTEM auf $($env:VITE_HOSTSYSTEM)" -ForegroundColor Green

$env:VITE_FINANCEAPI_URL = "http://$($env:VITE_HOST_IP):8002"
Write-Host "Setze VITE_FINANCEAPI_URL auf $($env:VITE_FINANCEAPI_URL)" -ForegroundColor Green

$env:VITE_ASTROAPI_URL = "http://$($env:VITE_HOST_IP):8001"
Write-Host "Setze VITE_ASTROAPI_URL auf $($env:VITE_ASTROAPI_URL)" -ForegroundColor Green

# Schritt 2: Docker Compose starten. Es wird die oben gesetzte Variable automatisch verwenden.
Write-Host "Starte Docker Compose (dies kann einen Moment dauern)..."
docker-compose up --build -d # .\start-dev.ps1