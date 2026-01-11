//
// V1.001 - 20.12.2022
//



class EconomicNetwork {
    // Klassendefinition einer Regel WENN => DANN
    constructor() {
        this._economicRules = 0;                  // Zählt die im Netzwerk angemeldeten EconomicRules
        this._EconomicRules = [];

        this._processed = false;                // Merkmal, ob dieses Netzwerk bereits abgearbeitet wurde

        console.log("New EconomicNetwork created");
    }


    addEconomicRule = function (myNewEconomicRule) {

      console.log("NewEconomicRule added to networt ");

      this._EconomicRules[this._economicRules] = myNewEconomicRule;

      this._economicRules = this._economicRules + 1;
      return this._economicRules

    }


    showAllEconomicRules = function () {

      console.log("Es hat im Netwerk EconomicRules = " + this._economicRules);

      for (let i = 0; i < this._economicRules; i++) {
        this._EconomicRules[i].sayRule();
      }

    }



    findRuleWithIFDataset = function (myDataset, rekursLevel) {

      console.log("Now searching left part of the rule in network");
      var ResultText = document.getElementById("Reaction");
      // ResultText.append("\nNow searching left part of the rule in network");
      
      // erhöhe Rekursionslevel um 1
      rekursLevel = rekursLevel + 1;

      // für jede Regel
      for (let i = 0; i < this._economicRules; i++) {

        console.log("UNTERSUCHE i = " + i);
        // ResultText.append("\nOn Level " + rekursLevel + " - Checking Rule Number " + i);
        
        // Hole das IF und THEN Dataset der Regel
        var ifDataset;
        ifDataset = this._EconomicRules[i]._IFDataset;

        var thenDataset;
        thenDataset = this._EconomicRules[i]._THENDataset;

        // passt das IF Dataset der untersuchten Regel zum myDataset?
        var result;
        result = ifDataset.identicalWithDataset(myDataset);

        if (result == true) { 
          console.log("Identical Rule found"); 
          ResultText.append("\nValid Rule Found");
          // FÜR JEDE GEFUNDENE IF SEITE MUSS MIT DER DANN SEITE EINE NEUE REGEL GEFEUERT WERDEN
          // ACHTUNG AUF ENDLOSSCHLEIFEN => FEUERN NUR DANN WENN DIE IF REGEL NOCH NICHT IM NETZWERK GEFEUERT WURDE
          if (ifDataset._processed == false) {
            ifDataset.processed(); // setzte die Regel als bearbeitet für den nächsten Durchlauf

            // feuere das Netzwerk jetzt mit der THEN Regel
            console.log("==> REACTION FOUND WITH "); this._EconomicRules[i]._THENDataset.showEconomicDataset();
            ResultText.append("\n==> REACTION FOUND WITH ..." + this._EconomicRules[i]._THENDataset.showEconomicDataset());
            ResultText.append("\n==> Reaction found in words: " + this._EconomicRules[i]._ruledescription);

            console.log("With that reaction next rule fired");
            ResultText.append("\nWith that reaction next rule fired");
            this.findRuleWithIFDataset(this._EconomicRules[i]._THENDataset, rekursLevel);   

            // return i; // übergebe den Index der gefundenen Regel

          } else {
            console.log("Rule already fired");

            // return i; // übergebe den Index der gefundenen Regel
          }

        } else { 
          console.log("Identical Rule not found"); 
          // ResultText.append("\nValid Rule NOT Found");
          // return -1; // -1 als Zeichen dass keine Regel gefunden wurde
        };

      }



    }



    fireNetwork = function (myFiredDataset) {

      console.log("Network fired with " + myFiredDataset._myWhat + "/" + myFiredDataset._myAction + "/" + myFiredDataset._myWhere);
      var ResultText = document.getElementById("Reaction");
      ResultText.append("\nFIRING NETWORT WITH ..." + myFiredDataset.showEconomicDataset());

      var myDatasetFound;
      myDatasetFound = this.findRuleWithIFDataset(myFiredDataset, 0); // 0. Level => erstaufruf

    }


}
