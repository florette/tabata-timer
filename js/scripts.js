
var allExercises = [];
var countTraining = 20;
var countPause = 10;

function getData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var responseText = JSON.parse(this.responseText);
            build(responseText.HIIT);
        }
    };

    xhttp.open('get', '//florette.github.io/tabata-workout/js/HIIT.json', true);
    xhttp.send();
}

getData();

var build = function(data) {
    var allData = [];

    for (var i = 0; i < data.length; i++) {
        allData.push(data[i])
    }

    console.log(allData);

    var processData = function() {
        for (i = 0; i < allData.length; i++) {
            // console.log(allExercises[i].serie);
            var repeat = allData[i].repeat;
            // Make series
            var serie = Array.apply(null, Array(repeat)).map(function(){return allData[i].serie}); 

            function flatten(arr) {
                return arr.reduce(function (flat, toFlatten) {
                    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
                }, []);
            }
            
            serie = flatten(serie);
            console.log(serie);
            allExercises.push(serie);
        }
    
        allExercises = flatten(allExercises);
    
        console.log('allExercises',allExercises);
        
        
    }

    var makeListChildren = function() {
        var list = document.querySelector('.exercise__list-js');
        var html = '';
        allExercises.forEach(function (item, index) {
            html += '<li class="item__training">' +
            '<h2 class="section__title">' + item + '</h2></li>';
            html += '<li class="item__pause"><h2 class="section__title">Rest</h2></li>';
        });

        list.insertAdjacentHTML('beforeend', html);
    }

    // Call functions
    
    processData();
    makeListChildren();
    makeActive();
    handleTimer();
}

var handleTimer = function() {
    var buttonStart = document.querySelector('.btn__start-js');
    buttonStart.addEventListener('click', clickStart.bind(this, buttonStart));
}

var clickStart = function(buttonStart) {
    buttonStart.classList.add('hide');
    counter(countTraining);
}

var listItem = document.querySelector('.exercise__list').getElementsByTagName('li');

console.log(listItem)

var listItemIndex = 0;

var makeActive = function() {
    // Add class active to the first list item
    listItem[listItemIndex].classList.add('active');
    populateNext();
}

var counterActive = true;

var activeClass = function() {
    if (listItemIndex === (listItem.length - 2)) {
        alert('stop')
        counterActive = false;
    } else {
        listItem[listItemIndex].classList.remove('active');
        listItem[listItemIndex].classList.add('complete');
    
        listItemIndex++;
        listItem[listItemIndex].classList.add('active');  
    }  
}

var populateNext = function() {
    var listItemIndexNext = listItemIndex + 1;
    var text = listItem[listItemIndexNext].innerText;
    var destination = document.querySelector('.section__more-linktext');
    destination.innerHTML = text;
}

var counter = function(number) {
    var count = number;
    var timerDiv = document.querySelector('.timer-js');
    var interval = setInterval(function() {
        if (count >= 0 && counterActive === true) {
            console.log(count);
            timerDiv.innerHTML = count;
        } else if (count === -1 && counterActive === true) {
            var isTrain = function(n) {
                return n & 1;
            }

            var isPause = function(n) {
                return !( n & 1 );
            }

            if (isTrain(listItemIndex)) {
                console.log('Is train')
                clearInterval(interval);
                counter(countTraining)
                activeClass();
                populateNext();
            } else if (isPause(listItemIndex)) {
                console.log('Is pause')
                clearInterval(interval);
                counter(countPause)
                activeClass();
                populateNext();
            }
        }
        count--;
    }, 1000); 
}


