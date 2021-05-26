/**
 * liste zentrieren
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
        //diese Variablen dienen dazu, die aktuelle Teilliste jederzeit abfragen zu können
        this.currentBegin = 0;
        this.currentEnd = this.options.toSort.length - 1;

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

            // Set class on container to identify it as a greeting card
            // container.  Allows for styling later.
            $container.addClass("QuickSort");

            $container.append('<div id="ul-div">  <div class="table"> <ul style="list-style-type:none;" id="UnLi"> </ul>   </div>  </div>');

            function showList() {

                $('#PivotLabelInput').empty().append(self.pivotList[0]);
                $.each(self.toDisplay, function (index, number) {
                    var new_html = number;

                    $('#UnLi').append($('<class="horizontal" id="' + index + '"li></li>').html("&nbsp;&nbsp;" + new_html));
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


            /**
             * 
             * Diese Methode dient dazu, den Fortschrittsbalken bei korrekter Eingabe vorwärts zu bewegen
             */
            width = 0;
            cnt = 0;
            function update() {
                cnt++;
                var element = document.getElementById("myBar");
                width += parseInt(self.stepSize);
                //Wenn diese Bedingung zutrifft, ist der Durchlauf erreicht und die Rundungsfehler müssen ausgeglichen werden 
                if (cnt == self.numberOfCalls) {
                    width = 100;
                }
                element.style.width = width + '%';
                element.innerHTML = width + "%";
            }

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
                self.stepSize = 100 / self.fData.length;
                self.numberOfCalls = self.fData.length;
            });

            $container.append('<div id="detailsdiv">    <details id="instruction"> <summary>Hilfe</summary <p> Die Liste soll mittels Quick-Sort sortiert werden.' +
                ' Dazu müssen die korrekten Indizes eingegeben, und die entsprechende Methode mithilfe der Buttons ausgeführt werden. Das Pivot wird automatisch berechnet und eingeblendet.' +
                ' Bei richtiger Eingabe bewegt sich der Fortschrittsbalken. Zur Lösung ist es notwendig, <b>exakt</b> den Algorithmus aus der Vorlesung anzuwenden.</p></details>   </div>');

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

            inputswapfirstBool = false;
            document.getElementById("InputSwapFirst").onchange = function () {
                input = getFirstInput();

                if ((self.leftInput != self.rightInput)) {
                    document.getElementById(self.leftInput).style.color = "black";
                }
                self.leftInput = markSelected(input);
            }

            inputswapsecondBool = false;
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

            function swap(items, leftIndex, rightIndex) {
                self.fData.push(0);
                self.data.push(leftIndex);
                self.data.push(rightIndex);

                var temp = items[leftIndex];
                items[leftIndex] = items[rightIndex];
                items[rightIndex] = temp;
            }

            function partition(items, li, re, piv) {
                //Die Abfrage des Boolean b dient dazu, den ersten Partitionsaufruf nicht mitzuzählen
                if (!self.firstPartition) {
                    self.fData.push(1);
                    self.data.push(li);
                    self.data.push(re);
                }
                self.firstPartition = false;


                var i = li; //left pointer
                var j = re - 1; //right pointer
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
                        swap(items, i, j); //sawpping two elements
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

                        console.log("richtig!");

                        update();

                        temp = self.toDisplay[swapFirstRef];
                        self.toDisplay[swapFirstRef] = self.toDisplay[swapSecRef];
                        self.toDisplay[swapSecRef] = temp;

                        $listSelector = $("#UnLi").empty();
                        showList();

                        var mydiv = document.getElementById("VerifiedInputs");
                        mydiv.innerHTML = "Swap(" + swapFirstRef + "," + swapSecRef + ")";
                        //mydiv.appendChild(document.createTextNode("Swap("+swapFirstRef+","+swapSecRef+")"));


                    } else {
                        console.log("Leider falsch");
                    }
                } else {
                    console.log("Falsche Methode");
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
                    /**
                     * Hier werden die Benutzereingaben mit den korrekten Werten des zuvor durchgeführten Algorithmus verglichen
                     * Bei korrekter Eingabe werden die Referenzwerte des Algorithmus vom Stack gepopt
                     *  */
                    if ((partFirstIn == partFirstRef) && (partpSecIn == partSecRef)) {
                        self.pivotList.shift();
                        self.data.shift();
                        self.data.shift();
                        self.fData.shift();

                        self.currentBegin = partFirstRef;
                        self.currentEnd = partSecRef;

                        console.log("richtig!");
                        update();

                        self.sortetTemp.push(self.sortet[0]);
                        self.sortet.shift();

                        $listSelector = $("#UnLi").empty();
                        showList();

                        var mydiv = document.getElementById("VerifiedInputs");
                        mydiv.innerHTML = "Part(" + partFirstRef + "," + partSecRef + ")";
                        //mydiv.appendChild(document.createTextNode("Part("+partFirstRef+","+partSecRef+")"  ));

                        if (self.pivotList.length == 0) {
                            console.log("Fertig sortiert!")
                        }
                    } else {
                        console.log("Leider falsch");
                    }
                } else {
                    console.log("Falsche Methode");
                }
            }
        };
    };

    return C;

})(H5P.jQuery);