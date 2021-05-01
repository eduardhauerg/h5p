var H5P = H5P || {};
 
H5P.QuickSort = (function ($) {
  /*
   * Constructor function.
   */
  function C(options, id) {
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
        toSort: '42'
    }, options);
    // Keep provided id.
    this.id = id;
    this.list = this.options.toSort.split(',').map(x =>+x);
    this.list = quickSort(this.list, 0, this.list.length - 1);
    

  }; 

  /**
   * Attach function called by H5P framework to insert H5P content into
   * page
   *
   * @param {jQuery} $container
   */
  C.prototype.attach = function ($container) {

    // Set class on container to identify it as a greeting card
    // container.  Allows for styling later.
    $container.addClass("QuickSort");
    // Add image if provided.

    // Add greeting text.
    $container.append('<div class="greeting-text">' + this.options.toSort+ '</div>');
    $container.append('<div class="greeting-text">' + this.list+ '</div>');

    $container.append('<button id="ButtonSwap" class="inputSwap" type="button" id="swapBtn">Swap</button>');
    $container.append('<label id="InputSwapLeftBracket" class="inputSwap" for="swap">(</label> ');
    $container.append('<input id="InputSwapFirst" class="inputSwap" type="text"/>');
    $container.append('<label id="InputSwapComma" class="inputSwap" for="partition">,</label> ');
    $container.append('<input id="InputSwapSecond" class="inputSwap" type="text"/>'); 
    $container.append('<label id="InputSwapRightBracket" class="inputSwap" for="partition">)</label> ');

    $container.append('<button id="ButtonPart" class="inputPart" type="button" id="partBtn">Partitioniere</button>');
    $container.append('<label id="InputPartLeftBracket" class="inputPart" for="partition">(</label> ');
    $container.append('<input id="InputPartFirst" class="inputPart" type="text"/>');
    $container.append('<label id="InputPartComma" class="inputPart" for="partition">,</label> ');
    $container.append('<input id="InputPartSecond" class="inputPart" type="text"/>'); 
    $container.append('<label id="InputPartRightBracket" class="inputPart" for="partition">)</label> ');


  };
 
  return C;
})(H5P.jQuery);




//var items = [5,3,7,6,2,9]; 
function swap(items, leftIndex, rightIndex){
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
}
function partition(items, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)], //middle element
        i       = left, //left pointer
        j       = right; //right pointer
    while (i <= j) {
        while (items[i] < pivot) {
            i++;
        }
        while (items[j] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    return i;
}

function quickSort(items, left, right) {
    var index;
    if (items.length > 1) {
        index = partition(items, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSort(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            quickSort(items, index, right);
        }
    }
    return items;
}

// first call to quick sort
//var sortedArray = quickSort(items, 0, items.length - 1);
//console.log(sortedArray); //prints [2,3,5,6,7,9]


