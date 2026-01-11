
function loadScript(src) {
  // Dynamisch ein Skript laden und ein Promise zurückgeben
  // das aufgelöst wird, wenn das Skript geladen ist
  console.log(`🔄 Lade Skript: ${src}`);
  return new Promise((resolve, reject) => {
    // Überprüfe, ob das Skript bereits geladen ist
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Fehler beim Laden von ${src}`));
    document.body.appendChild(script);
  });
}

async function loadDependencies() {
  // Lade alle notwendigen Skripte nacheinander
  await loadScript("ifthenclasses.js");
  await loadScript("EconomicDataset.js");
  await loadScript("EconomicRule.js");
  await loadScript("EconomicNetwork.js");
}



function waitForElement(id, timeout = 3000) {
  // Warte, bis ein Element mit der gegebenen ID im DOM verfügbar ist
  // oder bis das Timeout erreicht ist
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const el = document.getElementById(id);
      if (el) return resolve(el);
      if (Date.now() - start > timeout) return reject(`⏳ Element #${id} nicht gefunden`);
      requestAnimationFrame(check);
    };
    check();
  });
}



async function initializeDashboard() {
  // Lade alle Abhängigkeiten
  // und warte, bis die Listboxen im DOM verfügbar sind
  // und initialisiere die Listboxen
  console.log("🚀 Initialisiere Dashboard...");
  try {
    // Lade alle Abhängigkeiten
    await loadDependencies();
    console.log("✅ Alle Abhängigkeiten wurden geladen");

    // Warte, bis die Listboxen im DOM verfügbar sind
    await waitForElement("WhatListBox");
    await waitForElement("WhereListBox");
    await waitForElement("ActionListBox");

    // Defensive Check: Sind die Variablen verfügbar?
    if (!Array.isArray(What) || typeof MaxNumberOfWhat !== "number") {
      throw new Error("❌ Daten für WhatListBox nicht verfügbar");
    }

    loadWhatListBox();
    loadWhereListBox();
    loadActionListBox();

    const button = document.getElementById("button");
    if (button) button.addEventListener("click", buttonclicked);
  } catch (err) {
    console.error("❌ Initialisierungsfehler:", err);
  }
}

// Erst wenn das Fenster (window) komplett geladen ist, wird initializeDashboard aufgerufen.
window.addEventListener("load", initializeDashboard);


// Lade die Listbox mit Werten
function loadWhatListBox() {
    console.log ("function loadWhatListBox() started");
    for (let i = 0; i <= MaxNumberOfWhat; i++) {
        var opt = document.createElement("option");
        opt.text = What[i];
        opt.value = What[i];
        document.getElementById("WhatListBox").options.add(opt); 
    }

}


// Lade die Listbox mit Werten
function loadWhereListBox() {
    console.log ("function loadWhereListBox() started");
    for (let i = 0; i <= MaxNumberOfWhere; i++) {
        var opt = document.createElement("option");
        opt.text = Where[i];
        opt.value = Where[i];
        document.getElementById("WhereListBox").options.add(opt); 
    }

}


// Lade die Listbox mit Werten
function loadActionListBox() {
    console.log ("function loadActionListBox() started");
    for (let i = 0; i <= MaxNumberOfActions; i++) {
        var opt = document.createElement("option");
        opt.text = Action[i];
        opt.value = Action[i];
        document.getElementById("ActionListBox").options.add(opt); 
    }

}



function buttonclicked() {
    console.log ("function buttonclicked() started ---------------------------");

    // welcher Entität wurde in der Listbox ausgewählt
    var what = document.getElementById("WhatListBox");
    var strSelected1 = what.selectedIndex; // e.options[e.selectedIndex].value
    var choosen1 = "ausgewählt wurde what = " + What[strSelected1];
    console.log (choosen1);

    // welcher Region wurde in der Listbox ausgewählt
    var where = document.getElementById("WhereListBox");
    var strSelected3 = where.selectedIndex; // e.options[e.selectedIndex].value
    var choosen3 = "ausgewählt wurde Where = " + Where[strSelected3];
    console.log (choosen3);

    // welcher Action wurde in der Listbox ausgewählt
    var action = document.getElementById("ActionListBox");
    var strSelected2 = action.selectedIndex; // e.options[e.selectedIndex].value
    var choosen2 = "ausgewählt wurde Action = " + Action[strSelected2];
    console.log (choosen2);


    // ausgewähltes feuerndes Datenset aufbauen
    var MyFiringDataset = new EconomicDataset(What[strSelected1], Where[strSelected3], Action[strSelected2]);
    
    var ResultText = document.getElementById("Reaction");
    ResultText.textContent = ""; // Inhalt zu Beginn leeren
    ResultText.append("\nBulding Network Rules ---------------------------");

    // Baue Netzwerk auf (hier temporär)
    var myEconomicNetwork = new EconomicNetwork();

    var i = 0;
    for (let i = 0; i <= MaxNumberOfRules; i++) {
        console.log ("Bulding a single new rule number ");
        var rule = new EconomicRule(RulesIfWhat[i], RulesIfWhere[i], RulesIfChange[i], RulesThenWhat[i], RulesThenWhere[i], RulesThenChange[i], RuleDescription[i]);
        console.log(rule.sayRule());
        // ResultText.append("\n" + i + " " + rule.sayRule());
        myEconomicNetwork.addEconomicRule(rule);

    }

    
    // suche alle Regeln mit WENN = initialClass
    // Führe für jede Regel die DANN Seite durch und wende die Reaktion auf das passende Set an
    myEconomicNetwork.fireNetwork(MyFiringDataset);


    console.log ("Network analyzed completely ---------------------------");
    ResultText.append("\nEND Network analyzed completely ---------------------------");

}

