// V1.001 - 20.12.2022
//
// Klasse EconomicRule beschreibt einen WENN => DANN Zusammenhang
// Die Regeln basieren auf den EcoconomicDataset Klasse
// Genau genommen besteht folgende Beziehung
// WENN EconomicDataset1 DANN EconomicDataset2

class EconomicRule {
    // Klassendefinition einer Regel WENN => DANN
    constructor(ifWhat, ifWhere, ifAction, thenWhat, thenWhere, thenAction, ruledescription) {

        // this._ifWhat = ifWhat;                  // WENN Teil - was wird verändert? - Leitzinsen
        // this._ifWhere = ifWhere;                // WENN Teil - wo ist die Ursache? - Bsp. US
        // this._ifAction = ifAction;              // WENN Teil - wie ändert sich das was (up or down)? - steigen

        // this._thenWhat = thenWhat;              // DANN Teil - was verändert sich in der Wirkung? - Bsp. US
        // this._thenWhere = thenWhere;            // DANN Teil - wo ist die Wirkung? - Bsp. US
        // this._thenAction = thenAction;          // DANN Teil - wie verändert es sich?

        // this._ruledescrition = ruledescrition;       // Regelbeschreibung in Freitext

        this._processed = false;                // Merkmal, ob diese Regel bereits abgearbeitet wurde
                                                // false = Regel wurde noch nicht bearbeitet, true = Regel wurde schon bearbeitet

        this._IFDataset = new EconomicDataset(ifWhat, ifWhere, ifAction); 
        this._THENDataset = new EconomicDataset(thenWhat, thenWhere, thenAction); 
        this._ruledescription = ruledescription; 

        console.log("New Rule IF THEN Created");
    }


    _IFDataset = function() {
      return this._IFDataset;
    }
    

    _THENDataset = function() {
      return this._THENDataset;
    }

    _ruledescription = function() {
      return this._ruledescription;
    }


    processed = function () {

      return true;      // die regel wurde bearbeitet
    } 


    sayRule = function () {
        return ("My Rule is IF " + this._IFDataset._myWhat + "/" + this._IFDataset._myWhere + "/" + this._IFDataset._myAction + " THEN " + this._THENDataset._myWhat + "/" + this._THENDataset._myWhere + "/" + this._THENDataset._myAction + " or in words: " + this._ruledescription);
    }


  }



