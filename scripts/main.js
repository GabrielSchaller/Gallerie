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

var firstChildren = [];

function io_callback(entries, observer){
    entries.forEach(entry => {
        if(entry.isIntersecting == false){
            if(entry.target.active == true){
                entry.target.display = "none";
            }
            entry.target.active = false;
        }else{
            const dcopy = entry.target.cloneNode(true);
            const parent = entry.target.parentElement;
            if(parent.classList[0] == "columnR"){
                parent.insertBefore(dcopy, null);
            }else{
                if(parent.contains(firstChildren[0])){
                    parent.insertBefore(dcopy, firstChildren[0]);
                    firstChildren[0] = dcopy;
                }else if(parent.contains(firstChildren[1])){
                    parent.insertBefore(dcopy, firstChildren[1]);
                    firstChildren[1] = dcopy;
                }else{
                    console.log(firstChildren);
                }
            }
            dcopy.active = null;
            intersectionObs.observe(dcopy);
            entry.target.active = true;
        }
    });
}

const io_options = {
    root: document.body,
    threshhold: 0
};

const intersectionObs = new IntersectionObserver(io_callback, io_options);

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
            img.loading = "lazy";
            const cont = document.createElement("div");
            cont.classList.add("container");
            cont.active = null;
            cont.append(img);
            var i = Math.floor(Math.random()*3);
            if(i%3 == 0){
                var arr = Array.from(document.getElementsByClassName("column"))[0];
                arr.append(cont);
            }
            else if(i%3 == 1){
                document.getElementsByClassName("columnR")[0].append(cont);
            }else{
                var arr = Array.from(document.getElementsByClassName("column"))[1];
                arr.append(cont);
            }
            intersectionObs.observe(cont);
        }
    });
}

function init_imgs(){
    var files = [];
    firstChildren = Array.from(document.getElementsByClassName("marker"));
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