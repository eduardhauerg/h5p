/*
ein weitere attribut, in dem jeder swap und jeder part gespeichert wird. 
nachdem der alg gelaufen ist, dieses array mit den eingaben des users validieren. 
*/

var H5P = H5P || {};
 
H5P.QuickSort = (function ($) {

  function C(options, id) {
      var self = this;
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
        toSort: '0',
        //pivot: '0'
    }, options);
    // Keep provided id.
    this.id = id;
    this.options.toSort = this.options.toSort.split(',').map(x =>+x);
    this.toDisplay = this.options.toSort;
    this.data = [];
    this.fData = [];
    this.b = false;

    //this.options.toSort = quickSort(this.options.toSort, 0, this.options.toSort.length - 1);
    self.attach = function ($container) {

        // Set class on container to identify it as a greeting card
        // container.  Allows for styling later.
        $container.addClass("QuickSort");
    
        $container.append('<div class="greeting-text" id="list">' + this.toDisplay+ '</div>');
        //$container.append('<div class="greeting-text">' + this.options.pivot+ '</div>');
    
        $container.append('<button id="ButtonSwap" class="inputSwap" type="button" id="swapBtn">Swap</button>');
        $container.append('<label id="InputSwapLeftBracket" class="inputSwap" for="swap">(</label> ');
        $container.append('<input id="InputSwapFirst" type="text" class="inputSwap" />');
        $container.append('<label id="InputSwapComma" class="inputSwap" for="partition">,</label> ');
        $container.append('<input id="InputSwapSecond" class="inputSwap" type="text"/>'); 
        $container.append('<label id="InputSwapRightBracket" class="inputSwap" for="partition">)</label> ');
    
        $container.append('<button id="ButtonPart" class="inputPart" type="button" id="partBtn">Partitioniere</button>');
        $container.append('<label id="InputPartLeftBracket" class="inputPart" for="partition">(</label> ');
        $container.append('<input id="InputPartFirst" class="inputPart" type="text"/>');
        $container.append('<label id="InputPartComma" class="inputPart" for="partition">,</label> ');
        $container.append('<input id="InputPartSecond" class="inputPart" type="text"/>'); 
        $container.append('<label id="InputPartRightBracket" class="inputPart" for="partition">)</label> ');
    
        $container.append('<button id="start"> Start </button>');

        function validation(given, reference) {
            return (given == reference);
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
            if(self.b) {
                self.fData.push(1);
                self.data.push(li);
                self.data.push(re);
            }
            self.b = true;

            i = li; //left pointer
            j = re - 1; //right pointer
            k = items[piv]; 
            swap(items, piv, re);
     
            while (i < j) {
                while (items[i] <= k && i < re) {
                    i++;
                }
                while (items[j] >= k && j > li) {
                    j--;
                }
                if (i < j) {
                    swap(items, i, j); //sawpping two elements
                }
            }
            if (items[i] > k) {
                swap(items, i, re);
            }
            return i;
        }

        function quickSort(items, li, re) {

           if(li < re) {
                //pivpos = Math.floor(items.length / 2) - 1;
                pivpos = Math.floor((li+(re+1)) / 2);
                console.log(pivpos);
                pivpos = partition(items, li,re,pivpos);

                quickSort(items, li, pivpos - 1);
                quickSort(items, pivpos + 1, re);
            }
        }

        document.getElementById("start").onclick = function() {
            console.log("liste: "+ self.options.toSort);
            quickSort(self.options.toSort, 0, self.options.toSort.length - 1);
            console.log(self.data);
            console.log(self.fData);
            console.log("liste: "+ self.options.toSort);

        }
        


        //pruefe hier als erstes, ob das erste element im zweiten array das korrekte ist. sonst direkt false 
        document.getElementById("ButtonSwap").onclick = function() {
            if(self.fData[0] == 0){
                var swapFirstRef = self.data[0];
                var swapSecRef = self.data[1];

                var swapFirstIn = document.getElementById("InputSwapFirst").value;
                var swapSecIn = document.getElementById("InputSwapSecond").value;

                if( validation(swapFirstIn, swapFirstRef) && validation(swapSecIn, swapSecRef )) {
                    self.data.shift();
                    self.data.shift();
                    self.fData.shift();

                    console.log("richtig!");
                    var temp = self.toDisplay[swapFirstRef];
                    self.toDisplay[swapFirstRef] = self.toDisplay[swapSecRef];
                    self.toDisplay[swapSecRef] = temp;
                    document.getElementById("list").innerHTML = self.toDisplay;
                } else {
                    console.log("leider falsch");
                }
            }else{
                console.log("Falsche Methode");
            }
        }
        
        document.getElementById("ButtonPart").onclick = function() {
            if(self.fData[0] == 1) {
                var partFirstRef = self.data[0];
                var partSecRef = self.data[1];

                var partFirstIn = document.getElementById("InputPartFirst").value;
                var partpSecIn = document.getElementById("InputPartSecond").value;

                if( validation( partFirstIn, partFirstRef) && validation(partpSecIn, partSecRef )) {
                    self.data.shift();
                    self.data.shift();
                    self.fData.shift();

                    console.log("richtig!");
                    self.toDisplay = self.toDisplay.slice(partFirstRef, partSecRef);   
                    document.getElementById("list").innerHTML = self.toDisplay;
                } else {
                    console.log("leider falsch");
                }
            } else {
                console.log("Falsche Methode");
            }
        }
        
    };

  }; 

  return C;
})(H5P.jQuery);



