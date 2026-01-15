let map;
let routeBoxer;
let auto;
let directionsRenderers = [];
let iosource;

function cal()
{
	calculateRoute();
}
        function initMap() {
            map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: 22.2587, lng: 71.1924}, // Gujarat
	//center: { lat: currentlat, lng: currentlng},
                zoom: 7,
                mapTypeControl:false,
                fullscreenControl:false,
            	    streetViewControl: false,
            });
	
            routeBoxer = new RouteBoxer();
	auto = new AutocompleteDirectionsHandler(map);
        }
class AutocompleteDirectionsHandler {
  map;
  originPlaceId;
  destinationPlaceId;
  travelMode;
  constructor(map) {
    this.map = map;
     this.originPlaceId = "";
    this.destinationPlaceId = "";
    this.travelMode = google.maps.TravelMode.WALKING;
    this.directionsService = new google.maps.DirectionsService();
    this.altRenderer = new google.maps.DirectionsRenderer();
    this.service = new google.maps.places.AutocompleteService();
    const originInput = document.getElementById("origininput");
    const destinationInput = document.getElementById("destinationinput");
    const suggestions = document.getElementById("suggestions");
    // Specify just the place data fields that you need.
    this.setupPlaceChangedListener(originInput, suggestions);
    this.setupPlaceChangedListener(destinationInput, suggestions);
   originInput.style.display="flex";
   originInput.style.flexdirection="column";
   destinationInput.style.display="flex";
   destinationInput.style.flexdirection="column";
   const ODinput = document.getElementById("odinput");
   this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(ODinput);
  }
  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
 setupPlaceChangedListener(autocomplete, mode) {
 const input = autocomplete;
  const suggestionsBox = mode;
  input.addEventListener('input', function () {
	
    const value = input.value;
    if (!value) {
      suggestionsBox.innerHTML = "";
      //return;
    }

    auto.service.getPlacePredictions({ input: value }, (predictions, status) => {
      suggestionsBox.innerHTML = "";
      if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) 
	{return;}
      predictions.forEach(prediction => {
        const div = document.createElement('div');
         const mainText = prediction.structured_formatting.main_text;   // Place name
    const secondaryText = prediction.structured_formatting.secondary_text; // Address
    div.innerHTML = "<img src='Live img.png' style='height:5%;width:5%;float:left;padding:5px;'><div style='font-weight:420;font-size:16px;float:left;width:90%;padding-top:2px;'>"+mainText+"</div><div style='font-size:14px; color: #555;border-bottom: 1px solid black;float:right;width:96%;padding-left:10px;'>"+secondaryText+"</div>";
        div.addEventListener('click', () => {
          input.value = prediction.description;
          suggestionsBox.innerHTML = "";
          // You can now use PlacesService to get full details if needed
        });
        suggestionsBox.appendChild(div);
      });
    });
  }); 
}
}
function calculateRoute() {
	let request;
	//alert(directionsRenderers.length);
	for (let i = 0; i < directionsRenderers.length; i++) {
        		directionsRenderers[i].setMap(null);
    		}
    		directionsRenderers = []; // Clear the array
	auto.altRenderer = [];
	if(document.getElementById("origininput").value=="")
	{
          	 request = {
                //origin: document.getElementById("origininput").value,
	origin: { lat: latitude, lng: longitude },
                destination:  document.getElementById("destinationinput").value,
                travelMode: google.maps.TravelMode.DRIVING,
                provideRouteAlternatives : true
            		};
	}
	else
	{
		request = {
                origin: document.getElementById("origininput").value,
	//origin: { lat: latitude, lng: longitude },
                destination:  document.getElementById("destinationinput").value,
                travelMode: google.maps.TravelMode.DRIVING,
                provideRouteAlternatives : true
            		};
	}
            auto.directionsService.route(request, function (result, status) {
                if (status === google.maps.DirectionsStatus.OK) {
	for(var i=0; i< result.routes.length; i++)
	{
	  auto.altRenderer = new google.maps.DirectionsRenderer({
                            map: map,
                            directions: result,
                            routeIndex: i,
                        });
	  let totaldistance = 0;
	  for(let j = 0; j < result.routes[i].legs.length; j++)
	{
		totaldistance = totaldistance + result.routes[ i ].legs[ j ].distance.value;
	}
	totaldistance = totaldistance / 1000;
                    const path = result.routes[i].overview_path;
	  const patharray = path.map(coord => ({ lat: coord.lat(), lng: coord.lng()}));
                    //const distance = totaldistance / 32; // Distance (in km) for each box
	  let distance;
	if (totaldistance <= 30){ distance = 3; }
	else if (totaldistance > 30 && totaldistance <= 50){ distance = 5; }
	else if (totaldistance > 50 && totaldistance <= 100){ distance = 8; }
	else if (totaldistance > 100 && totaldistance <= 200){ distance = 10; }
	else if (totaldistance > 200 && totaldistance <= 500){ distance = 20; }
	else if (totaldistance > 500 && totaldistance <= 1000){ distance = 30; }
	else{ distance = 40; }
	 //window.alert(totaldistance+" "+distance);
	 let firstlat = patharray[0].lat;
	 let lastlat = patharray[patharray.length-1].lat;
	 let firstlng = patharray[0].lng;
	 let lastlng = patharray[patharray.length-1].lng;
	 let dlat;
	 let dlng;
	 let l;
	 //window.alert(firstlat);
	if(firstlat >= lastlat)
	{
		dlat = firstlat - lastlat;
		//window.alert(dlat);
	}
	else
	{
		dlat = lastlat - firstlat;
		//window.alert(dlat);
	}
	if(firstlng >= lastlng)
	{
		dlng = firstlng - lastlng;
		//window.alert(dlng);
	}
	else
	{
		dlng = lastlng - firstlng;
		//window.alert(dlng);
	}
	if(dlat >= dlng)
	{
		l=0;
	}
	else
	{
		l=1;
	}
                    const boxes = routeBoxer.box(path, distance, l);
	//drawBoxes(boxes);
	logBoxCoordinates(boxes);
	directionsRenderers.push(auto.altRenderer);
	}	
                }
            });
        }
 function drawBoxes(boxes) {
            for (let i = 0; i < boxes.length; i++) {
                new google.maps.Rectangle({
                    bounds: boxes[i],
                    fillColor: "#FF0000",
                    fillOpacity: 0.1,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    map: map
                });
            }
        }
 function logBoxCoordinates(boxes) {
            boxes.forEach((box, index) => {
                const sw = box.getSouthWest();
                const ne = box.getNorthEast();
                // Four corners of the box
                const nw = { lat: ne.lat(), lng: sw.lng() };
                const se = { lat: sw.lat(), lng: ne.lng() };
	//window.alert(ne.lat()+" "+ne.lng()+" "+sw.lat()+" "+sw.lng());
               /* console.log(Box ${index + 1}:);
                console.log(SW: (${sw.lat()}, ${sw.lng()}));
                console.log(SE: (${se.lat()}, ${se.lng()}));
                console.log(NE: (${ne.lat()}, ${ne.lng()}));
                console.log(NW: (${nw.lat()}, ${nw.lng()}));
                console.log('---------------------');*/
            });
        }
function setsd(id)
{
	iosource = document.getElementById(id).value;
}
function checksd(id)
{
	if(document.getElementById(id).value!=iosource && document.getElementById(id).value!="")
	{
		document.getElementById(id).value = iosource;
	}
	else if(document.getElementById(id).value=="")
	{
		cal();
	}
	else
	{
	}
}