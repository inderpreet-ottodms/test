var sourceElement = null;

export function test1(){
  // console.log('Calling test 1 function');
}
function dragstart(e)
{
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", this.src);
    sourceElement = this;
    // console.log("Dragging Started");
}

window.onload = function() {
document.getElementById("img1").addEventListener("dragstart", dragstart, false);
document.getElementById("img2").addEventListener("dragstart", dragstart, false);
document.getElementById("img3").addEventListener("dragstart", dragstart, false);
document.getElementById("img1").addEventListener("drag", drag, false);
document.getElementById("img2").addEventListener("drag", drag, false);
document.getElementById("img3").addEventListener("drag", drag, false);
document.getElementById("img1").addEventListener("dragend", dragend, false);
document.getElementById("img2").addEventListener("dragend", dragend, false);
document.getElementById("img3").addEventListener("dragend", dragend, false);
document.getElementById("img1").addEventListener("dragenter", dragenter, false);
document.getElementById("img2").addEventListener("dragenter", dragenter, false);
document.getElementById("img3").addEventListener("dragenter", dragenter, false);
document.getElementById("img1").addEventListener("dragover", dragover, false);
document.getElementById("img2").addEventListener("dragover", dragover, false);
document.getElementById("img3").addEventListener("dragover", dragover, false);
document.getElementById("img1").addEventListener("dragleave", dragleave, false);
document.getElementById("img2").addEventListener("dragleave", dragleave, false);
document.getElementById("img3").addEventListener("dragleave", dragleave, false);
document.getElementById("img1").addEventListener("drop", drop, false);
document.getElementById("img2").addEventListener("drop", drop, false);
document.getElementById("img3").addEventListener("drop", drop, false);

};


function drag()
{
    console.log("Dragging");
}


function dragend(e)
{
    // console.log("Dragging ended");
}


function dragenter()
{
    // console.log("Dragged element enters droping zone");
}

function dragover(e)
{
    e.preventDefault(); ////default browser action is not to make any element a dropable zone. We are preventing the default action for this element to make it a droppable zone.
    e.dataTransfer.dropEffect = "move";
    // console.log("Dragged element enters droping zone");
}


function dragleave()
{
    console.log("Dragged element left target zone");
}


function drop(e)
{
    e.stopPropagation();////browsers usually redirect after drop event. I don't know why? Its beffer to stop it by stopping bubbling of the event to the browser window.
    var url = this.src;
    this.src = e.dataTransfer.getData("text/plain");
    sourceElement.src = url;
    // console.log("Dragged element dropped on target");
}


