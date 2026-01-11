// config.js

// In jedem HTML-Dokument, das mit dem FastAPI-Server kommuniziert:
// <script src="config.js"></script>
// Wichtig: config.js muss vor allen anderen Skripten eingebunden werden, die AppConfig verwenden.
// Beispiel für API-Aufruf
//  fetch(`${AppConfig.baseURL}/api/data`)


(function () {

    let ACER_HOST_APACHE_HTTP_PORT="8080"   // FOR ACER
    let QNAP_HOST_APACHE_HTTP_PORT="8088"   // FOR QNAP

    let ACER_HOST_FASTAPI_PORT="8002"       // FOR ACER
    let QNAP_HOST_FASTAPI_PORT="8888"       // FOR QNAP

    // Automatisch die aktuelle Host-IP und Port erkennen
    const currentHost = window.location.hostname;
    const currentPort = window.location.port;

    // Optional: Erkennung nach Hostname oder Port
    const isNAS = currentPort === QNAP_HOST_APACHE_HTTP_PORT || currentHost.includes("qnap");
    const isLocal = currentPort === ACER_HOST_APACHE_HTTP_PORT || currentHost === "localhost";

    // Konfigurierbare Basis-URL
    const config = {
        host: currentHost,
        port: currentPort || (isNAS ? QNAP_HOST_APACHE_HTTP_PORT : ACER_HOST_APACHE_HTTP_PORT),
        baseURL: `http://${currentHost}:${currentPort || (isNAS ? QNAP_HOST_APACHE_HTTP_PORT : ACER_HOST_APACHE_HTTP_PORT)}`,
        fastapiURL: `http://${currentHost}:${isNAS ? QNAP_HOST_FASTAPI_PORT : ACER_HOST_FASTAPI_PORT}`,
        environment: isNAS ? "NAS" : isLocal ? "Laptop" : "Unknown"
    };

    // Global verfügbar machen
    window.AppConfig = config;

    // speichern (in Fenster A)
    localStorage.setItem("AppConfig", JSON.stringify(config));

})();
