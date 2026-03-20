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

function addPicture(source){
    fetch(source, {method: "HEAD"})
    .then((res) =>{
        if(res.status != 404){
            const img = document.createElement("img");
            img.classList.add("picture");
            img.src = source;
            const cont = document.createElement("div");
            cont.classList.add("container");
            cont.append(img);
            var i = Math.floor(Math.random()*3);
            if(i%3 == 0){
                Array.from(document.getElementsByClassName("column"))[0].append(cont);
            }
            else if(i%3 == 1){
                document.getElementsByClassName("columnR")[0].append(cont);
            }else{
                Array.from(document.getElementsByClassName("column"))[1].append(cont);
            }
        }
    });
}

function init_imgs(){
    var files = [];
    fetch("files.json")
    .then((res) => res.text())
    .then((text) => {
        var json = JSON.parse(text);
        const artists = json["creators"];
        const prompts = json["prompts"];
        var prompt = 0;
        for(var artist = 0; artist < json["creators"].length; artist++){
            for(var prompt = 0; prompt < json["prompts"].length; prompt++){
                files.push("bilder/" + String(artists[artist]) + String(prompts[prompt]) + ".jpg");
            }
        }
        shuffle(files);
        for(var i=0; i<files.length;i++){
            addPicture(files[i]);
        }
    });
}