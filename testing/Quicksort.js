/*
TO-DO:
#anzeige für das aktuelle pivot
#wenn beide auf einer zahl stehen, macht der erste der weggeht, diese wieder schwarz
#mehrere aufgaben auf einer Seite
#feedback für korrekte / inkorrekte Eingabe
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
    //Dieser bool sorgt dafür, das der erste Partitionierungsaufruf nicht vom Benutzer eingegeben werden muss 
    this.b = false;

    self.attach = function ($container) {

        // Set class on container to identify it as a greeting card
        // container.  Allows for styling later.
        $container.addClass("QuickSort");
    
        $container.append('<ul style="list-style-type:none;" id="UnLi"> </ul>');

        function showList() {
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

        $container.append('<button id="ButtonSwap" class="inputSwap" type="button" id="swapBtn">Swap</button>');
        $container.append('<label id="IndexLabel" for="partition">Index: </label> ');
        $container.append('<label id="IndexLabelInput" for="partition"></label> ');
        document.getElementById("ButtonSwap").disabled = true;
        $container.append('<label id="InputSwapLeftBracket" class="inputSwap" for="swap">(</label> ');
        $container.append('<input id="InputSwapFirst" type="text" class="inputSwap" />');
        $container.append('<label id="InputSwapComma" class="inputSwap" for="partition">,</label> ');
        $container.append('<input id="InputSwapSecond" class="inputSwap" type="text"/>'); 
        $container.append('<label id="InputSwapRightBracket" class="inputSwap" for="partition">)</label> ');
    
        $container.append('<button id="ButtonPart" class="inputPart" type="button" id="partBtn">Partitioniere</button>');
        document.getElementById("ButtonPart").disabled = true;

    
        $container.append('<button id="start"> Start </button>')

        document.getElementById("start").onclick = function() {

            quickSort(self.options.toSort, 0, self.options.toSort.length - 1);
            console.log(self.data);
            console.log(self.fData);
            console.log("liste: "+ self.options.toSort);

            document.getElementById("ButtonSwap").disabled = false;
            document.getElementById("ButtonPart").disabled = false;
            document.getElementById("start").disabled = true;
        }

        $container.append('<label id="VerifiedInputs"> </label>');

        inputswapfirstBool = false;
        document.getElementById("InputSwapFirst").onchange = function() {
            markSelectedRed("InputSwapFirst"); 
        }

        inputswapsecondBool = false;
        document.getElementById("InputSwapSecond").onchange = function() { 
            markSelectedRed("InputSwapSecond"); 
        }      
        
        function markSelectedRed(button) {
            var b = document.getElementById(button).value;

            if(b  < self.options.toSort.length) {
                inputswapsecondBool = true;
                tempb = b;
                var elem = document.getElementById(b);
                var color = window.getComputedStyle(elem).getPropertyValue("color");

                if( !(checkIfNotGreen(color))) {
                    document.getElementById(b).style.color = "red";
                }
            }
        }

        function checkIfNotGreen(color) {
            return (color === 'rgb(0, 128, 0)');
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
            if(self.b) {
                self.fData.push(1);
                self.data.push(li);
                self.data.push(re);
            }
            self.b = true;


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

                if( (swapFirstIn == swapFirstRef) && (swapSecIn == swapSecRef)) {
                    self.data.shift();
                    self.data.shift();
                    self.fData.shift();

                    console.log("richtig!");

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
            self.options.partsteps--;
            if(self.fData[0] == 1) {
                var partFirstRef = self.data[0];
                var partSecRef = self.data[1];

                var partFirstIn = document.getElementById("InputSwapFirst").value;
                var partpSecIn = document.getElementById("InputSwapSecond").value;

                if( (partFirstIn == partFirstRef) && (partpSecIn == partSecRef) ) {

                    self.data.shift();
                    self.data.shift();
                    self.fData.shift();

                    self.currentBegin = partFirstRef;
                    self.currentEnd = partSecRef;

                    console.log("richtig!");

                    $listSelector = $("#UnLi").empty();
                    self.sortetTemp.push(self.sortet[0]);

                    showList();
                    self.sortet.shift();

                    var mydiv = document.getElementById("VerifiedInputs");
                    mydiv.appendChild(document.createTextNode("Partitioniere("+partFirstRef+","+partSecRef+")"  ));
                    if(self.options.partsteps == 0) {
                        console.log("Alles richtig!");
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