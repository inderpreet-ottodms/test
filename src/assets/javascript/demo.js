import { createTrue } from "typescript";

export function test1() {
}
var sourceElement = null;

export function dragstart(e) {
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", this.src);
  sourceElement = this;
}
window.addEventListener("dragover", function (e) {
  e = e || event;
  e.preventDefault();
}, false);
window.addEventListener("drop", function (e) {
  e = e || event;
  e.preventDefault();
}, false);
export function regiserEvent() {
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
}



export function initializeMap(address) {
  var directionsDisplay, directionsService;
  var latlng;
  var address = address;
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    'address': address
  }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      latlng = results[0].geometry.location;
      var mapOptions = {
        zoom: 17,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.roadmap,
        disableDefaultUI: false, // a way to quickly hide all controls
        mapTypeControl: false,
        scaleControl: true,
        zoomControl: true,
        streetViewControl: true,
      }

      if (document.getElementById('map-canvas') !== null) {
      //  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        // var customStyled = [{
        //   featureType: "all",
        //   elementType: "labels",
        //   stylers: [
        //     { visibility: "off" }
        //   ]
        // }];//(array shown above)
        // map.set('styles',customStyled);
      }
      if (document.getElementById('map-canvas') !== null) {
      //  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        // var customStyled = [{
        //   featureType: "all",
        //   elementType: "labels",
        //   stylers: [
        //     { visibility: "off" }
        //   ]
        // }];//(array shown above)
        // map.set('styles',customStyled);
      }
      var infowindow = new google.maps.InfoWindow({
        content: '<b>' + address + '</b>',
        size: new google.maps.Size(150, 50)
      });

      var marker = new google.maps.Marker({
        position: results[0].geometry.location,
        map: map,
        title: address
      });
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
      });
      // directionsService = new google.maps.DirectionsService();
      // directionsDisplay = new google.maps.DirectionsRenderer({
      //   suppressMarkers: true
      // });
      // directionsDisplay.setMap(map);
      // var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      //   var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      // var marker = new google.maps.Marker({
      //     map: map,
      //     draggable: true,
      //     position: latlng
      // });
      // google.maps.event.addListener(marker, 'dragend', function () {
      //     latlng = marker.getPosition();
      // });
    } else {
      console.log("Geocode was not successful for the following reason: " + status);
    }
  });
}
export function openFullscreen() {
  var elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

export function saveMap() {
  alert("your lat is " + latlng);
}
export function regiserEvent2() {

  if (document.getElementById("img-1") !== null) {
    console.log("event 2 fired");
    document.getElementById("img-1").addEventListener("dragstart", dragstart, false);
    document.getElementById("img-2").addEventListener("dragstart", dragstart, false);
    document.getElementById("img-3").addEventListener("dragstart", dragstart, false);
    document.getElementById("img-1").addEventListener("drag", drag, false);
    document.getElementById("img-2").addEventListener("drag", drag, false);
    document.getElementById("img-3").addEventListener("drag", drag, false);
    document.getElementById("img-1").addEventListener("dragend", dragend, false);
    document.getElementById("img-2").addEventListener("dragend", dragend, false);
    document.getElementById("img-3").addEventListener("dragend", dragend, false);
    document.getElementById("img-1").addEventListener("dragenter", dragenter, false);
    document.getElementById("img-2").addEventListener("dragenter", dragenter, false);
    document.getElementById("img-3").addEventListener("dragenter", dragenter, false);
    document.getElementById("img-1").addEventListener("dragover", dragover, false);
    document.getElementById("img-2").addEventListener("dragover", dragover, false);
    document.getElementById("img-3").addEventListener("dragover", dragover, false);
    document.getElementById("img-1").addEventListener("dragleave", dragleave, false);
    document.getElementById("img-2").addEventListener("dragleave", dragleave, false);
    document.getElementById("img-3").addEventListener("dragleave", dragleave, false);
    document.getElementById("img-1").addEventListener("drop", drop, false);
    document.getElementById("img-2").addEventListener("drop", drop, false);
    document.getElementById("img-3").addEventListener("drop", drop, false);
  }
}

window.onload = function () {
  if (document.getElementById("img1") !== null) {
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
  }

  if (document.getElementById("img-1") !== null) {
    document.getElementById("img-1").addEventListener("dragstart", dragstart, false);
    document.getElementById("img-2").addEventListener("dragstart", dragstart, false);
    document.getElementById("img-3").addEventListener("dragstart", dragstart, false);
    document.getElementById("img-1").addEventListener("drag", drag, false);
    document.getElementById("img-2").addEventListener("drag", drag, false);
    document.getElementById("img-3").addEventListener("drag", drag, false);
    document.getElementById("img-1").addEventListener("dragend", dragend, false);
    document.getElementById("img-2").addEventListener("dragend", dragend, false);
    document.getElementById("img-3").addEventListener("dragend", dragend, false);
    document.getElementById("img-1").addEventListener("dragenter", dragenter, false);
    document.getElementById("img-2").addEventListener("dragenter", dragenter, false);
    document.getElementById("img-3").addEventListener("dragenter", dragenter, false);
    document.getElementById("img-1").addEventListener("dragover", dragover, false);
    document.getElementById("img-2").addEventListener("dragover", dragover, false);
    document.getElementById("img-3").addEventListener("dragover", dragover, false);
    document.getElementById("img-1").addEventListener("dragleave", dragleave, false);
    document.getElementById("img-2").addEventListener("dragleave", dragleave, false);
    document.getElementById("img-3").addEventListener("dragleave", dragleave, false);
    document.getElementById("img-1").addEventListener("drop", drop, false);
    document.getElementById("img-2").addEventListener("drop", drop, false);
    document.getElementById("img-3").addEventListener("drop", drop, false);
  }
};


export function drag() {
}


export function dragend(e) {
}


export function dragenter() {
}

export function dragover(e) {
  e.preventDefault(); ////default browser action is not to make any element a dropable zone. We are preventing the default action for this element to make it a droppable zone.
  e.dataTransfer.dropEffect = "move";
}


export function dragleave() {
}


export function drop(e) {
  ;
  console.log("draeg start");
  e.stopPropagation();////browsers usually redirect after drop event. I don't know why? Its beffer to stop it by stopping bubbling of the event to the browser window.
  var url = this.src;
  this.src = e.dataTransfer.getData("text/plain");
  sourceElement.src = url;
}
