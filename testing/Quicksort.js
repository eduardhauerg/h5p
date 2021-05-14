/*

TO-DO:
# ende einbauen (mit einer Übersicht aller korrekten Eingaben)
# Option einbauen um den Pseudo-Code als User-Hilfe einzublenden
# mehrere aufgaben auf einer Seite (evtl drupal problem, erst auf moodle testen)
- Grünfärbung der korrekten Elemente (dafür anschauen, wie der alg am ende abschließt)
*/ 

var H5P = H5P || {};
 
H5P.QuickSort = (function ($) {

  function C(options, id) {
    var self = this;
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
        toSort: '0',
        partsteps: 1
    }, options);
    // Keep provided id.
    this.id = id;
    this.options.toSort = this.options.toSort.split(',').map(x =>+ x);
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
    if(this.options.toSort.length > 10) {
        this.options.toSort = this.options.toSort.slice(0,10);
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
    
        $container.append('<ul style="list-style-type:none;" id="UnLi"> </ul>');

        function showList() {

            $('#PivotLabelInput').empty().append(self.pivotList[0]);
 
            $.each(self.toDisplay, function(index, number) {
                var new_html = number;
                $('#UnLi').append($('<class="horizontal" id="'+index+'"li></li>').html(new_html+"    "));
                
                //Diese Abfrage dient dazu, nur die aktuelle Teilliste fett darzustellen
                if(index < self.currentBegin || index > self.currentEnd ) {
                    console.log(index);
                    $('#'+index).css("font-weight","normal");
                }

                $('#'+index).mouseover(function() {
                    $('#IndexLabelInput').empty().append(index);
                });
            });
            //Mithilfe dieser Schleife, werden die bereits am korrekten Index stehenden Zahlen grün eingefärbt
            for(i = 0; i < self.sortetTemp.length; i++) {
                $('#'+self.sortetTemp[i]).css("color","green");
            }
        }
        showList();

        $container.append('<label id="IndexLabel" for="partition">Index: </label> ');
        $container.append('<label id="IndexLabelInput" for="partition"></label> ');

        $container.append('<label id= "PivotLabel" for="partition">Pivot:  </label>');
        $container.append('<label id= "PivotLabelInput" for="partition"></label> ');

        $container.append('<div class="btn-group"><button id="ButtonPart" class="button" type="button">Partitioniere</button> <button id="ButtonSwap" class="button" type="button">Swap</button></div>');

        document.getElementById("ButtonPart").disabled = true;     
        document.getElementById("ButtonSwap").disabled = true;

        $container.append('<label id="InputSwapLeftBracket" class="inputSwap" for="swap">(</label> ');
        $container.append('<input id="InputSwapFirst" type="text" class="inputSwap" />');
        document.getElementById("InputSwapFirst").disabled = true;

        $container.append('<label id="InputSwapComma" class="inputSwap" for="partition">,</label> ');
        $container.append('<input id="InputSwapSecond" class="inputSwap" type="text"/>'); 
        document.getElementById("InputSwapSecond").disabled = true;

        $container.append('<label id="InputSwapRightBracket" class="inputSwap" for="partition">)</label> ');
    


        $container.append('<div id="myProgress"><div id="myBar"></div></div>');

        width = 0;
        cnt = 0;
        function update() {
            cnt++;
            var element = document.getElementById("myBar");   
            width += parseInt(self.stepSize);
            //Wenn diese Bedingung zutrifft, ist der Durchlauf erreicht und die Rundungsfehler müssen ausgeglichen werden 
            if(cnt == self.numberOfCalls) {
                width = 100;
            }
            element.style.width = width + '%'; 
            element.innerHTML = width + "%";
        }

        $container.append('<button id="start"> Start </button>');
        document.getElementById("start").onclick = function() {

            quickSort(self.options.toSort, 0, self.options.toSort.length - 1);
            console.log(self.data);
            console.log(self.fData);
            console.log("liste: "+ self.options.toSort);

            document.getElementById("ButtonSwap").disabled = false;
            document.getElementById("ButtonPart").disabled = false;

            document.getElementById("InputSwapFirst").disabled = false;
            document.getElementById("InputSwapSecond").disabled = false;


            document.getElementById("start").disabled = true;

            $('#PivotLabelInput').empty().append(self.pivotList[0]);
            self.stepSize = 100 / self.fData.length;
            self.numberOfCalls = self.fData.length;
        }

        $container.append('<label id="VerifiedInputs"> </label>');

        /*
        die if abfrage dient dazu, bei gleicher indizierung die rote Markierung beizubehalten
        */
        inputswapfirstBool = false;
        document.getElementById("InputSwapFirst").onchange = function() {
            if(document.getElementById("InputSwapFirst").value) {

            if( (self.leftInput != self.rightInput)&& (! checkIfGreen(self.rightInput)) ) {
                document.getElementById(self.leftInput).style.color = "black";
            }
            self.leftInput = markSelectedRed("InputSwapFirst"); 
        }
        }

        inputswapsecondBool = false;
        document.getElementById("InputSwapSecond").onchange = function() { 
            if(document.getElementById("InputSwapSecond").value) {
                if( (self.rightInput != self.leftInput) && (! checkIfGreen(self.rightInput)) ) {
                    document.getElementById(self.rightInput).style.color = "black";
                }
                self.rightInput = markSelectedRed("InputSwapSecond"); 
        }
        }      
        
        function markSelectedRed(button) {
            var b = document.getElementById(button).value;
        
            if(b  < self.options.toSort.length) {
                inputswapsecondBool = true;
                tempb = b;

                if( !(checkIfGreen(b))) {
                    document.getElementById(b).style.color = "red";
                }
            }
            return b;
        }

        function checkIfGreen(b) {

            var elem = document.getElementById(b);
            var color = window.getComputedStyle(elem).getPropertyValue("color");
            return (color == 'rgb(0, 128, 0)');

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
            if(! self.firstPartition) {
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
            if(li < re) {

                var pivpos = Math.floor((li+re) / 2);
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

        document.getElementById("ButtonSwap").onclick = function() {

            if(self.fData[0] == 0){
                var swapFirstRef = self.data[0];
                var swapSecRef = self.data[1];

                var swapFirstIn = document.getElementById("InputSwapFirst").value;
                var swapSecIn = document.getElementById("InputSwapSecond").value;

                $('#InputSwapFirst').val('');
                $('#InputSwapSecond').val('');

                

                if( (swapFirstIn == swapFirstRef) && (swapSecIn == swapSecRef)) {
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
                    mydiv.appendChild(document.createTextNode("Swap("+swapFirstRef+","+swapSecRef+")   "));

                } else {
                    console.log("Leider falsch");
                }
            } else{
                console.log("Falsche Methode");
            }
        }

        document.getElementById("ButtonPart").onclick = function() {
            if(self.fData[0] == 1) {

                var partFirstRef = self.data[0];
                var partSecRef = self.data[1];

                var partFirstIn = document.getElementById("InputSwapFirst").value;
                var partpSecIn = document.getElementById("InputSwapSecond").value;

                $('#InputSwapFirst').val('');
                $('#InputSwapSecond').val('');

                if( (partFirstIn == partFirstRef) && (partpSecIn == partSecRef) ) {
                    self.pivotList.shift();
                    self.data.shift();
                    self.data.shift();
                    self.fData.shift();

                    self.currentBegin = partFirstRef;
                    self.currentEnd = partSecRef;

                    console.log("richtig!");
                    self.options.partsteps--;
                    update();

                    self.sortetTemp.push(self.sortet[0]);
                    self.sortet.shift();




                    $listSelector = $("#UnLi").empty();
                    showList();

                    var mydiv = document.getElementById("VerifiedInputs");
                    mydiv.appendChild(document.createTextNode("Partitioniere("+partFirstRef+","+partSecRef+")"  ));
                    
                    if(self.options.partsteps == 0) {
                        console.log("Alles richtig!");
                    }
                    if(self.pivotList.length == 0) {
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