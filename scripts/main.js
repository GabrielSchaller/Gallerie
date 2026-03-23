function scroll(e){
    if(e.classList[0] == "column"){
        var temp = String(e.getBoundingClientRect().bottom - window.innerHeight + 100);
    }else{
        var temp = String(e.getBoundingClientRect().top - 100);
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
    var images = document.getElementById("imgs");
    images.style.width = "100dvw";
    images.style.transform = "translateX(33%)";
    images.style.filter = "blur(7px) brightness(70%) contrast(70%) saturate(30%)";
    newColumns.forEach(entry => {
        scroll(entry);
    })
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

const track = document.getElementById("button-track");
function addScroller() {
    const width = window.innerWidth/2;
    track.style.transform = "translateX(-" + String(width) + "px)";
    track.dataset.sliderpercent = -50;
    setTimeout(() => {
        const handleOnDown = e => {
        //console.log(e.clientX);
            track.dataset.sliderstartx = e.clientX;
        }

        const handleOnMove = e => {
            if(track.dataset.sliderstartx == 0){
                return;
            }
            console.log(track.dataset.sliderpercent);
            console.log(track.dataset.sliderstartx);
            const diff = e.clientX - track.dataset.sliderstartx;
            const max = window.innerWidth / 2;
            const percent = parseFloat(track.dataset.sliderpercent) + diff/max*100;
            const pixels = percent/100*window.innerWidth;
            
            track.animate({
                transform: `translate(${pixels}px)`
            },{duration:1200, fill:"forwards"});
    }

        const handleOnUp = e => {
            const diff = e.clientX-track.dataset.sliderstartx;
            const max = window.innerWidth / 2;
            const percent = parseFloat(track.dataset.sliderpercent) + diff/max*100;
            track.dataset.sliderpercent = parseFloat(percent + track.dataset.sliderpercent);
            //console.log(track.dataset.sliderpercent);
            track.dataset.sliderstartx = 0;
        }

        window.onmousedown = e => handleOnDown(e);

        window.ontouchstart = e => handleOnDown(e.touches[0]);

        window.onmouseup = e => handleOnUp(e);

        window.ontouchend = e => handleOnUp(e.touches[0]);

        window.onmousemove = e => handleOnMove(e);

        window.ontouchmove = e => handleOnMove(e.touches[0]);
    }, 5000);
};

var button = document.getElementById("enter");
button.addEventListener("click", function(e){
    zoomOut();
    addScroller();
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
        //const artists = json["creators"];
        const prompts = json["prompts"];
        var prompt = 0;
        for(const key in prompts){
            var availableArtists = prompts[key];
            console.log(availableArtists);
            var rand = Math.floor(Math.random()*availableArtists.length);
            for(var artist = 0; artist < availableArtists.length; artist++){
                var source = "bilder/" + availableArtists[artist] + key + ".jpg";
                files.push(source);
                if(rand == artist){
                    var toAdd = "<div class=\"trackContainer\"   onclick=()\">\n      <img class=\"image\" src=\""+source+"\" draggable=\"false\"/>\n</div>\n    </div>\n";
                    track.insertAdjacentHTML("beforeEnd", toAdd);
                }
            }
        }
        shuffle(files);
        for(var i=0; i<files.length;i++){
            addPicture(files[i]);
        }
    });
}