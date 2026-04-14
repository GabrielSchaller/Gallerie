var mouseX;
var json;
var newTrack;
var diffX;

window.document.addEventListener("mousemove", function(event) {
    mouseX = event.clientX;
}, false);
window.document.addEventListener("touchmove", function(event) {
    mouseX = event.clientX;
}, false);

wiggle = function(node){
    node.children[1].getAnimations().forEach((anim) => {
		anim.play();
	});
}

closePrompt = function() {
    var track = document.getElementById("button-track");
    var othertrack = document.getElementById("pausedTrack");
    const percent = parseFloat(document.getElementById("button-track").dataset.sliderpercent);
    const pixels = percent/100*window.innerWidth + window.innerWidth*0.5;
    track.animate({
        transform: `translate(0px)`
    },{duration:600, fill:"forwards"});
    const otherpercent = parseFloat(document.getElementById("pausedTrack").dataset.sliderpercent);
    const otherpixels = otherpercent/100*window.innerWidth;
    setTimeout(() => {
        othertrack.style.display = "flex";
        track.id = " ";
        track.remove();
        othertrack.id = "button-track";
        othertrack.animate({
            transform: `translate(${otherpixels}px)`
        },{duration:600, fill:"forwards"});
    }, 600);
    
}

openPrompt = function(caller) {
    if(diffX >= 150){
        return;
    }
    var track = document.getElementById("button-track");
    var artists = json["prompts"][caller];
    track.id = "pausedTrack";
    newTrack = document.createElement("div");
    document.getElementById("trackInside").append(newTrack);
    newTrack.id = "button-track";
    newTrack.dataset.sliderstartx = "0";
    newTrack.dataset.sliderpercent = "0";
    newTrack.style.draggable = false;
    newTrack.style.cursor = "auto";
    newTrack.style.transition = "transform 1s ease-in-out";
    shuffle(artists);
    var button = "<button type=\"button\" id=\"X\" onclick=\"closePrompt()\">X</button>";
    newTrack.insertAdjacentHTML("beforeEnd", button);
    artists.forEach(entry => {
        var source = "bilder/" + entry + caller + ".jpg";
        var toAdd = "<div class=\"trackContainer\"> <img class=\"image\" src=\""+source+"\" draggable=\"false\"></div>";
        newTrack.insertAdjacentHTML("beforeEnd", toAdd);
    })
    const width = window.innerWidth/2;
    const height = window.innerHeight;
    const percent = parseFloat(document.getElementById("pausedTrack").dataset.sliderpercent);
    const pixels = percent/100*window.innerWidth;
    track.animate({
        transform: `translate(${pixels}px, ${height}px)`
    },{duration:600, fill:"forwards"});
    setTimeout(() => {
        track.style.display = "none";
        newTrack.style.transform = "translateX(-" + String(width) + "px)";
        newTrack.dataset.sliderpercent = -50;
    }, 500);
};


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

document.addEventListener("DOMContentLoaded", function() {
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
    entry.addEventListener("transitionend", function() {
        entry.style.transformDuration = "500s";
        scroll(entry);
    });
});

function zoomOut(){
    var images = document.getElementById("imgs");
    images.style.width = "101dvw";
    images.style.transform = "translateX(32%)";
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

function addScroller() {
    const width = window.innerWidth/2;
    document.getElementById("button-track").style.transform = "translateX(-" + String(width) + "px)";
    document.getElementById("button-track").dataset.sliderpercent = -50;

    const handleOnDown = e => {
        document.getElementById("button-track").dataset.sliderstartx = e.clientX;
    }

    var handleOnUp = e => {
        document.getElementById("button-track").dataset.sliderstartx = 0;
    }

    window.onmousedown = e => handleOnDown(e);

    window.ontouchstart = e => handleOnDown(e.touches[0]);

    window.onmouseup = e => handleOnUp(e);

    window.ontouchend = e => handleOnUp(e.touches[0]);

    setTimeout(() => {
        window.document.removeEventListener("mousemove", function() {}, false);
        window.document.removeEventListener("touchmove", function() {}, false);
        
        if(document.getElementById("button-track").dataset.sliderstartx != 0) {
            document.getElementById("button-track").dataset.sliderstartx = mouseX;
        }
        const handleOnMove = e => {
            if(document.getElementById("button-track").dataset.sliderstartx == 0){
                return;
            }
            const diff = e.clientX - document.getElementById("button-track").dataset.sliderstartx;
            const max = window.innerWidth / 2;
            const percent = parseFloat(document.getElementById("button-track").dataset.sliderpercent) + diff/max*100;
            const pixels = percent/100*window.innerWidth;
            
            document.getElementById("button-track").animate({
                transform: `translate(${pixels}px)`
            },{duration:1200, fill:"forwards"});
    }

        handleOnUp = e => {
            diffX = Math.abs(document.getElementById("button-track").dataset.sliderstartx - e.clientX);
            const diff = e.clientX-document.getElementById("button-track").dataset.sliderstartx;
            const max = window.innerWidth / 2;
            const percent = parseFloat(document.getElementById("button-track").dataset.sliderpercent) + diff/max*100;
            document.getElementById("button-track").dataset.sliderpercent = parseFloat(percent + document.getElementById("button-track").dataset.sliderpercent);
            document.getElementById("button-track").dataset.sliderstartx = 0;
        }

        const handleOnScroll = e => {
            const max = window.innerWidth / 2;
            var percent;
            if(Math.abs(e.deltaX) > 50){
                percent = parseFloat(document.getElementById("button-track").dataset.sliderpercent) + e.deltaX/max*100;
            }else{
                percent = parseFloat(document.getElementById("button-track").dataset.sliderpercent) + e.deltaY/max*100;
            }
            const pixels = percent/100*window.innerWidth;
            document.getElementById("button-track").dataset.sliderpercent = parseFloat(percent);
            document.getElementById("button-track").animate({
                transform: `translate(${pixels}px)`
            },{duration:1200, fill:"forwards"});
        }

        window.onwheel = e => handleOnScroll(e);
        
        window.onmouseup = e => handleOnUp(e);

        window.ontouchend = e => handleOnUp(e.changedTouches[0]);

        window.onmousemove = e => handleOnMove(e);

        window.ontouchmove = e => handleOnMove(e.touches[0]);
    }, 4000);
};

var button = document.getElementById("enter");
button.addEventListener("click", function(e){
    zoomOut();
    addScroller();
    removeButton();
});

function io_callback(entries, observer){//rework this?
    entries.forEach(entry => {
        if(entry.isIntersecting == false){
            var rect = entry.target.getBoundingClientRect();
            if(rect.top > window.innerHeight && entry.target.parentElement.classList[0] == "column"){
                intersectionObs.unobserve(entry.target);
                setTimeout(() => {
                    t.style.visibility = "hidden";
                }, 30000, t=entry.target);
            }else if(rect.bottom < 20 && (entry.target.parentElement.classList[0] == "columnR" || entry.target.parentElement.classList[0] == "columnRhidden")){
                intersectionObs.unobserve(entry.target);
                setTimeout(() => {
                    t.style.visibility = "hidden";
                }, 30000, t=entry.target);
            }
        }else{
            const dcopy = entry.target.cloneNode(true);
            const parent = entry.target.parentElement;
            parent.append(dcopy);
            intersectionObs.observe(dcopy);
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
    //fetch(source, {method: "HEAD"})
    //.then((res) =>{
    //    if(res.status != 404){
            const img = document.createElement("img");
            img.classList.add("picture");
            img.src = source;
            img.loading = "lazy";
            img.draggable = false;
            const cont = document.createElement("div");
            cont.classList.add("container");
            cont.draggable = false;
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
            secArr.insertAdjacentElement("afterbegin", secCont);
            intersectionObs.observe(secCont);
            intersectionObs.observe(cont);
        //}
    //});
}

function init_imgs(){
    var files = [];
    var track = document.getElementById("button-track");
    fetch("files.json")
    .then((res) => res.text())
    .then((text) => {
        json = JSON.parse(text);
        const prompts = json["prompts"];
        for(const key in prompts){
            var availableArtists = prompts[key];
            var rand = Math.floor(Math.random()*availableArtists.length);
            for(var artist = 0; artist < availableArtists.length; artist++){
                var source = "bilder/" + availableArtists[artist] + key + ".jpg";
                files.push(source);
                if(rand == artist){
                    var toAdd = "<div class=\"trackContainer\" onclick=\"openPrompt('" + key + "')\" draggable=\"false\"><p>" + key + "</p><img class=\"image\" src=\""+source+"\" draggable=\"false\"></div>";
                    track.insertAdjacentHTML("beforeEnd", toAdd);
                }
            }
        }
        shuffle(files);
        for(var i=0; i<files.length;i++){
            addPicture(files[i]);
        }
        const cover = document.getElementById("cover");
        const columns = document.getElementsByClassName("column");
        const columnR = document.getElementsByClassName("columnR");
        for(i=0;i<3;i++){
            columns[0].children[i].children[0].loading = "eager";
            columns[1].children[i].children[0].loading = "eager";
            columnR[0].children[i].children[0].loading = "eager";
        }
        setTimeout(() => {
            cover.style.opacity = 0;
            setTimeout(() => {
                cover.remove();
            }, 1000);
        }, 500);
    });
}