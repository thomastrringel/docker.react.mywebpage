
class EconomicDataset {
    // definiert einen Value, z. B. Leitzinsen in einer region, z. B. USA
    constructor(myWhat, myWhere, myAction) {
      console.log("class Dataset initialized with " + myWhat + "/" + myWhere + "/" + myAction)
  
      this._myWhat = myWhat;                    // Leitzinsen
      this._myWhere = myWhere;                    // USA
      this._myAction = myAction;                    // Action
  
      this._processed = false;
    }  

    _myWhat = function() {
      return this._myWhat;
    }

    _myWhere = function() {
      return this._myWhere;
    }

    _myAction = function() {
      return this._myAction;
    }

    _processed = function() {
      return this._processed;
    }


    // Dataset wurde in einer Regel bearbeitet => darf kein zweites Mal gefeuert werden
    processed = function () {
      this._processed = true;
    }

    showEconomicDataset = function () {
        var ECDataset = " EconomicDataset = " + this._myWhat + "/"+ this._myWhere + "/" + this._myAction;
        console.log(ECDataset);

        return ECDataset;
        // var ResultText = document.getElementById("Reaction");
        // ResultText.append(ECDataset);

    }


    identicalWithDataset = function (myDatasetToCompareWith) {

      var result = true;

      var compared;

      compared = this._myWhat.localeCompare(myDatasetToCompareWith._myWhat);
      if (compared != 0) { result = false};

      compared = this._myWhere.localeCompare(myDatasetToCompareWith._myWhere);
      if (compared != 0) { result = false};

      compared = this._myAction.localeCompare(myDatasetToCompareWith._myAction);
      if (compared != 0) { result = false}; 

      console.log("Compare two Datasets = " + result);

      return result;

    }

  
  }

