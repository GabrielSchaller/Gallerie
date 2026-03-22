function scroll(e){
    if(e.classList[0] == "column"){
        var temp = String(e.getBoundingClientRect().bottom - window.innerHeight + 50);
    }else{
        var temp = String(e.getBoundingClientRect().top - 50);
    }
    if(e.style.transformOrigin){
        var transforms = e.style.transform.split(" ");
        if(transforms.length == 3){
            e.style.transform = "translateY(" + temp + "px)" + " " + transforms[1] + " " + transforms[2];
        }else if(e.classList[0] == "columnR"){
            if(transforms.length == 2){
                e.style.transform = "translateY(" + temp + "px)" + " " + transforms[1];
            }else{
                e.style.transform = "translateY(" + temp + "px)" + " " + transforms[0];
            }
            
        }else{
            e.style.transform = "translateY(" + temp + "px)" + " " + transforms[0] + " " + transforms[1];
        }
        
    }else{
        e.style.transform = "translateY(" + temp + "px)";
    }
};

document.addEventListener('DOMContentLoaded', function() {
    init_imgs();
    const scrollers = document.getElementsByClassName("column");
    const scrollersR = document.getElementsByClassName("columnR")
    Array.from(scrollers).forEach(scroll);
    Array.from(scrollersR).forEach(scroll);
}, false);

const columns = Array.from(document.getElementsByClassName("column"));
const columnR = Array.from(document.getElementsByClassName("columnR"))[0];
const newColumns = Array.from(document.getElementsByClassName("columnRhidden"));
const oldColumns = columns.concat(columnR);
const allColumns = oldColumns.concat(newColumns);

allColumns.forEach(entry => {
    entry.addEventListener('transitionend', function() {
        entry.style.transformDuration = "500s";
        scroll(entry);
    });
});

function zoomOut(){
    columnR.style.transitionDuration = "5s";
    columnR.style.transformOrigin = "50% 0";
    columnR.style.transform = "scale(0.5, 0.5)";
    columns[0].style.transform = "scale(0.5, 0.5) translateX(100%)";
    columns[1].style.transform = "scale(0.5, 0.5) translateX(-100%)";
    columns.forEach(entry => {
        entry.style.transitionDuration = "5s";
        entry.style.transformOrigin= "50% 100%";
    })
    newColumns.forEach(entry => {
            //TODO
    })
    var images = document.getElementById("imgs");
    images.style.transition = ("filter, 5s");
    images.style.filter = "blur(7px) brightness(70%) contrast(70%) saturate(30%)";
}
function removeButton(){
    button.style.transform = "scale(1.5, 3)";
    button.style.transition = ("opacity 3s, transform 3s");
    button.style.opacity = "0";
    setTimeout(() => {
        button.style.zIndex = "-1";
        button.style.display = "none";
    }, 3000);
}

var button = document.getElementById("enter");
button.addEventListener("click", function(e){
    zoomOut();
    //addScroller(); TODO
    removeButton();
});

var firstChildren = [];

function io_callback(entries, observer){
    entries.forEach(entry => {
        if(entry.isIntersecting == false){
            if(entry.target.active == true){
                var rect = entry.target.getBoundingClientRect();
                if(rect.top > window.innerHeight && entry.target.parentElement.classList[0] == "column"){
                    setTimeout(() => {
                        entry.target.style.display = "none";
                    }, 1000);
                }else if(rect.bottom < 0 && entry.target.parentElement.classList[0] != "column"){
                    setTimeout(() => {
                        entry.target.style.display = "none";
                    }, 1000);
                }
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
            const secCont = cont.cloneNode(true);
            if(i%2 == 0){
                var secArr = Array.from(document.getElementsByClassName("columnRhidden"))[0];
            }else{
                var secArr = Array.from(document.getElementsByClassName("columnRhidden"))[1];
            }
            secArr.append(secCont);
            intersectionObs.observe(secCont);
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