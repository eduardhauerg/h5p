/**
 * Feedback bei falscher Eingabe: Ränder der Input Fenster rot für 1 sek
 */

var H5P = H5P || {};

H5P.QuickSort = (function ($) {

    function C(options, id) {
        var self = this;
        // Extend defaults with provided options
        this.options = $.extend(true, {}, {
            toSort: '0',
        }, options);
        // Keep provided id.
        this.id = id;
        this.options.toSort = this.options.toSort.split(',').map(x => + x);
        this.parts = this.options.parts;
        //diese Variablen dienen dazu, die aktuelle Teilliste jederzeit abfragen zu können
        this.currentBegin = 0;
        this.currentEnd = this.options.toSort.length - 1;
        this.swapCounter = 1;
 
        /*
        Das Array sortet wird durch den Quick-Sort Algorithmus gefüllt
        Das Array sortetTemp dient dazu, den Kopf der Liste sortet nach und nach zu entnehmen und zu speichern
        */
        this.sortet = [];
        this.sortetTemp = [];

        //Falls das Array mehr als die zulässigen 10 Positionen enthält, wird dieses gekürzt
        if (this.options.toSort.length > 10) {
            this.options.toSort = this.options.toSort.slice(0, 10);
        }
        for (i = 0; i < this.options.toSort.length; i++) {
            if (this.options.toSort[i] > 99) {
                this.options.toSort[i] = 1;
            }
            if (this.options.toSort[i] < -99) {
                this.options.toSort[i] = -1;
            }
        }

        //Dieses Attribut dient zur späteren Visualisierung der einzelnen Schritte nach den Eingaben des Users
        this.toDisplay = JSON.parse(JSON.stringify(this.options.toSort));

        //In diesem Array werden die Parameter der Aufrufe swap und partition gespeichert
        this.data = [];
        //Dieses Array dient dazu, die Parameter der Liste data entweder der Funktion swap oder partition zuzuordnen
        this.fData = [];
        this.pivotList = [];

        //diese variable wird genutzt, um die Rundungsfehler bei der Anzeige in der Methode update() auszugleichen, sodass diese am Ende bei 100% steht
        this.numberOfCalls;

        //Dieser bool sorgt dafür, das der erste Partitionierungsaufruf nicht vom Benutzer eingegeben werden muss 
        this.firstPartition = true;

        this.leftInput = 0;
        this.rightInput = 0;

        this.stepSize;

        self.attach = function ($container) {
            
            function countSwaps() {
                var partCounter = self.parts;
                for(i = 0; i < self.fData.length; i++) {
                    if(self.fData[i] == 1) {
                        partCounter--;
                        if(partCounter == 0) {
                            break;
                        }
                    }
                    if(self.fData[i] == 0) {
                        self.swapCounter++;
                    }
                }
            }


            // Set class on container to identify it as a greeting card
            // container.  Allows for styling later.
            $container.addClass("QuickSort");

            $container.append('<div id="ul-div">  <div class="table"> <ul style="list-style-type:none;" id="UnLi"> </ul>   </div>  </div>');

            function showList() {

                $('#PivotLabelInput').empty().append(self.pivotList[0]);
                $.each(self.toDisplay, function (index, number) {
                    var new_html = number;

                    $('#UnLi').append($('<li class="horizontal" id="' + index + '"></li>').html(new_html));
                    //Diese Abfrage dient dazu, nur die aktuelle Teilliste fett darzustellen
                    if (index < self.currentBegin || index > self.currentEnd) {
                        console.log(index);
                        $('#' + index).css("font-weight", "100");
                    }
                    $('#' + index).mouseover(function () {
                        $('#IndexLabelInput').empty().append(index);
                    });
                });

            }
            showList();

            $container.append('<div id="labelsinputbuttons">   <div id="labels"> <div class="index-group"><label id="IndexLabel" for="partition">Index:&nbsp;&nbsp;</label><label id="IndexLabelInput" for="partition"></label>' +
                '  </div>  <div class="pivot-group"><label id= "PivotLabel" for="partition">Pivot:&nbsp;&nbsp;</label> <label id= "PivotLabelInput" for="partition"></label></div>' +
                '  </div>' +
                '  <div id="inputdiv">  <input id="InputSwapFirst" type="text" class="inputSwap" />  <input id="InputSwapSecond" class="inputSwap" type="int"/>  </div>' +
                '   <div class="btn-group"><button id="ButtonSwap" class="button" type="button">Swap</button><button id="ButtonPart" class="button" type="button">Partitioniere</button></div>' +
                '   </div>')


            document.getElementById("ButtonSwap").disabled = true;
            document.getElementById("ButtonPart").disabled = true;

            document.getElementById("InputSwapFirst").disabled = true;

            document.getElementById("InputSwapSecond").disabled = true;

            $container.append('<div id="lastinputdiv"> <label id="verifiedInputsLabel" class="lastInput"> Letzte Eingabe:<div id="VerifiedInputs" class="lastInput"> </div> </label>  </div>');

            $container.append('<div id="bardiv" ><div id="myProgress"><div id="myBar"></div></div> </div>');

            $container.append('<div id="detailsdiv">    <details id="instruction"> <summary>Hilfe</summary <p> Die Liste soll mittels Quick-Sort sortiert werden.' +
                ' Dazu müssen die korrekten Indizes eingegeben, und die entsprechende Methode mithilfe der Buttons ausgeführt werden. Das aktuelle Pivot wird automatisch berechnet und eingeblendet.' +
                ' Bei richtiger Eingabe bewegt sich der Fortschrittsbalken. Zur Lösung ist es notwendig, <b>exakt</b> den Algorithmus aus der Vorlesung anzuwenden.</p></details>   </div>');


            /**
             * 
             * Diese Methode dient dazu, den Fortschrittsbalken bei korrekter Eingabe vorwärts zu bewegen
             */
            width = 0;
            cnt = 0;
            function update() {
                console.log("parts: " + self.parts);

                cnt++;
                console.log(self.swapCounter);
                //Wenn diese Bedingung zutrifft, ist der Durchlauf erreicht und Rundungsfehler müssen ausgeglichen werden 
                if (cnt == self.swapCounter) {
                    width = 100;

                    document.getElementById("ButtonSwap").disabled = true;
                    document.getElementById("ButtonPart").disabled = true;
    
                    document.getElementById("InputSwapFirst").disabled = true;
                    document.getElementById("InputSwapSecond").disabled = true;
                } else {
                    width += parseInt(self.stepSize);


                }

                var element = document.getElementById("myBar");
                element.style.width = width + '%';
                element.innerHTML = width + "%";
            }
            /**
             *
             * Sobald das Dokument geladen wurde, wird der Quick-Sort Algorithmus durchgeführt. 
             * Die beiden Datenstrukturen zur Validierung der Benutzereingabe (data und fData), werden so gefüllt.
             */

            $(document).ready(function () {

                quickSort(self.options.toSort, 0, self.options.toSort.length - 1);
                console.log(self.data);
                console.log(self.fData);
                console.log("liste: " + self.options.toSort);

                document.getElementById("ButtonSwap").disabled = false;
                document.getElementById("ButtonPart").disabled = false;

                document.getElementById("InputSwapFirst").disabled = false;
                document.getElementById("InputSwapSecond").disabled = false;


                $('#PivotLabelInput').empty().append(self.pivotList[0]);
                self.numberOfCalls = self.fData.length;

                // Um den ersten Aufruf von Partitioniere nicht eingeben zu müssen, wird diese hier zunächst entfernt
                self.fData.shift();
                
                self.data.shift();
                self.data.shift();

                countSwaps();
                console.log(self.swapCounter);
                //self.stepSize = 100 / self.fData.length;
                self.stepSize = 100 / self.swapCounter;
            });

            /**
             * Diese beiden Methoden dienen dazu, die Benutzereingaben aus den beiden Inputfeldern entgegen zunehmen, sofern diese mit dem Index übereinstimmen. 
             */
            function getFirstInput() {
                val = document.getElementById("InputSwapFirst").value;
                if (val) {
                    if ((self.currentBegin >= val) || (val <= self.currentEnd)) {
                        return val;
                    }
                }
                return 0;
            }

            function getSecondInput() {
                val = document.getElementById("InputSwapSecond").value;
                if (val) {
                    if ((self.currentBegin >= val) || (val <= self.currentEnd)) {
                        return val;
                    }
                }
                return 0;
            }
            /**
             * 
             * Mithilfe dieser Methode werden die gewählten Indizes farblich markiert. 
             * Der Parameter leftInput bzw. rightInput sind in das Objekt ausgelagert, um so ein ggf. vorher ausgewähltes Element 
             * wieder in die ursprüngliche Farbe zurücksetzen zukönnen, bevor das neu gewählte Element markiert wird. 
             * 
             */
            document.getElementById("InputSwapFirst").onchange = function () {
                input = getFirstInput();

                if ((self.leftInput != self.rightInput)) {
                    document.getElementById(self.leftInput).style.color = "black";
                }
                self.leftInput = markSelected(input);
            }

            document.getElementById("InputSwapSecond").onchange = function () {
                input = getSecondInput();

                if ((self.rightInput != self.leftInput)) {
                    document.getElementById(self.rightInput).style.color = "black";
                }
                self.rightInput = markSelected(input);
            }

            function markSelected(b) {

                document.getElementById(b).style.color = "#7892c2";

                return b;
            }

            /*
            Pruefe hier als mittels fData zunächst ob die aufgerufene Funktion die korrekte ist. 
            Dafür zunächst die Benutzereingaben entnehmen, dann die Parameter der Aufrufe aus der Liste.
            Wenn validiert wurde, dass diese Nutzereingaben mit der vom Algorithmus durchgeführten Schritte übereinstimmen (Zeile 126),
            wird mittels shift der Kopf der Liste entfernt, sodass die nächsten Elemente nachrücken können.
            Die Funktion für den Button ButtonPart arbeitet analog.  
            */

            document.getElementById("ButtonSwap").onclick = function () {

                if (self.fData[0] == 0) {
                    var swapFirstRef = self.data[0];
                    var swapSecRef = self.data[1];

                    var swapFirstIn = document.getElementById("InputSwapFirst").value;
                    var swapSecIn = document.getElementById("InputSwapSecond").value;

                    $('#InputSwapFirst').val('');
                    $('#InputSwapSecond').val('');

                    if ((swapFirstIn == swapFirstRef) && (swapSecIn == swapSecRef)) {
                        self.data.shift();
                        self.data.shift();
                        self.fData.shift();

                        userFeedback(true);
                        update();
                        
                        //Hier werden die entsprechenden Elemente in der eingeblendeten Liste getauscht.
                        temp = self.toDisplay[swapFirstRef];
                        self.toDisplay[swapFirstRef] = self.toDisplay[swapSecRef];
                        self.toDisplay[swapSecRef] = temp;

                        //Die Liste wird geleert und neu gerendert
                        $listSelector = $("#UnLi").empty();
                        showList();

                        var mydiv = document.getElementById("VerifiedInputs");
                        mydiv.innerHTML = "Swap(" + swapFirstRef + "," + swapSecRef + ")";

                    } else {
                        userFeedback(false);
                    }
                } else {
                    userFeedback(false);
                }
            }

            document.getElementById("ButtonPart").onclick = function () {
                if (self.fData[0] == 1) {

                    var partFirstRef = self.data[0];
                    var partSecRef = self.data[1];

                    var partFirstIn = document.getElementById("InputSwapFirst").value;
                    var partpSecIn = document.getElementById("InputSwapSecond").value;
                    /** 
                    *Die Inputs werden bei Eingabe geleert
                    * */
                    $('#InputSwapFirst').val('');
                    $('#InputSwapSecond').val('');
                    if ((partFirstIn == partFirstRef) && (partpSecIn == partSecRef)) {
                        self.pivotList.shift();
                        self.data.shift();
                        self.data.shift();
                        self.fData.shift();

                        //Hier wird der Beginn und das Ende der aktuellen Teilliste neu gesetzt
                        self.currentBegin = partFirstRef;
                        self.currentEnd = partSecRef;
                        
                        userFeedback(true);
                        update();

                        self.sortetTemp.push(self.sortet[0]);
                        self.sortet.shift();

                        $listSelector = $("#UnLi").empty();
                        showList();

                        var mydiv = document.getElementById("VerifiedInputs");
                        mydiv.innerHTML = "Part(" + partFirstRef + "," + partSecRef + ")";

                    } else {
                        userFeedback(false);
                    }
                } else {
                    userFeedback(false);
                }
            }


            /**
             * 
             * Diese Methode dient zum visuellen Benutzer-Feedback nach der Eingabe.
             * Bei Eingabe eines Ergebnis, blinken die Ränder der Inputfelder in der entsprechenden Farbe.
             * 
             */
            function userFeedback(correct) {
                elemF = $('#InputSwapFirst');
                elemS = $('#InputSwapSecond');

                if(! correct) {
                    elemF.css('border-color', 'red');  
                    elemS.css('border-color', 'red');  

                    elemF.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                    elemS.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);

                } else {
                    elemF.css('border-color', 'green');  
                    elemS.css('border-color', 'green');  

                    elemF.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                    elemS.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                }

                $(document).ready(function () {
                    setTimeout( function ( ) {
                         elemF.css('border-color', '#7892c2');
                         elemS.css('border-color', '#7892c2');
                       }, 500);
                  });
            }
            /**
             *
             * Ab hier Quick-Sort Algorithmus 
             */
            function swap(items, leftIndex, rightIndex) {
                self.fData.push(0);
                self.data.push(leftIndex);
                self.data.push(rightIndex);

                var temp = items[leftIndex];
                items[leftIndex] = items[rightIndex];
                items[rightIndex] = temp;
            }

            function partition(items, li, re, piv) {
                    self.fData.push(1);
                    self.data.push(li);
                    self.data.push(re);


                var i = li; 
                var j = re - 1; 
                var k = items[piv];
                swap(items, piv, re);

                while (i < j) {
                    while ((items[i] <= k) && (i < re)) {
                        i = i + 1;
                    }
                    while ((items[j] >= k) && (j > li)) {
                        j = j - 1;
                    }
                    if (i < j) {
                        swap(items, i, j); 
                    }
                }
                if (items[i] > k) {
                    swap(items, i, re);
                }
                self.sortet.push(i);
                return i;
            }

            function quickSort(items, li, re) {
                if (li < re) {

                    var pivpos = Math.floor((li + re) / 2);
                    self.pivotList.push(self.options.toSort[pivpos]);
                    pivpos = partition(items, li, re, pivpos);

                    quickSort(items, li, (pivpos - 1));
                    quickSort(items, (pivpos + 1), re);
                }
            }

        };
    };

    return C;

})(H5P.jQuery);