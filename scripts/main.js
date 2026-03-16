import fs from 'fs;'
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

function init_imgs(){
    console.log("init");
    var dir = "bilder";
    var files = fs.readdirSync(dir);
    for(var i=0; i<files.length;i++){
        console.log(i);
    }
}