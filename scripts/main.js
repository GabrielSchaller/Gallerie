function scroll(e){
    e.style.transform = "translateY(10000px)";
}
function scrollR(e){
    e.style.transform = "translateY(-10000px)";
}
document.addEventListener('DOMContentLoaded', function() {
    init_imgs();
    const scrollers = document.getElementsByClassName("column");
    const scrollersR = document.getElementsByClassName("columnR")
    Array.from(scrollers).forEach(scroll);
    Array.from(scrollersR).forEach(scrollR);
}, false);

var button = document.getElementById("enter");
button.addEventListener("click", function(e){
    e.target.style.background = "pink";
});
function shuffle(array){
    var currentIndex = array.length;
    while(currentIndex != 0){
        var rand = Math.floor(Math.random()*currentIndex);
        currentIndex--;
        [array[currentIndex], array[rand]] = [array[rand], array[currentIndex]];
    }
}

function init_imgs(){
    console.log("init");
    var files = [];
    fetch("files.txt")
    .then((res) => res.text())
    .then((text) => {
        var json = JSON.parse(text);
        console.log(json);
        files.append();
    })
    .catch((e) => console.error(e));
    shuffle(files);
    var columns = Array.from(document.getElementsByClassName("column"));
    var firstColumn =  columns[0];
    var secondColumn = document.getElementsByClassName("columnR")[0];
    var thirdColumn = columns[1];
    for(var i=0; i<files.length;i++){
        const img = document.createElement("img");
        img.classList.add("picture");
        const cont = document.createElement("div");
        cont.classList.add("container");
        cont.append(img);
        img.src = files[i];
        if(i%3 == 0){
            firstColumn.appendChild(cont)
        }else if(i%3 == 1){
            secondColumn.appendChild(cont)
        }else{
            thirdColumn.appendChild(cont)
        }
    }
}