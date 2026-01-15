let imap;
let irouteBoxer;
let iauto;
let idirectionsRenderers = [];
let iiosource;
function ical()
{
	icalculateRoute();
}
        function iinitMap() {
		//alert("imap");
            imap = new google.maps.Map(document.getElementById("imap"), {
                center: { lat: 22.2587, lng: 71.1924}, // Gujarat
	//center: { lat: currentlat, lng: currentlng},
                zoom: 7,
                mapTypeControl:false,
                fullscreenControl:false
            });
            irouteBoxer = new RouteBoxer();
	iauto = new iAutocompleteDirectionsHandler(imap);
        }
class iAutocompleteDirectionsHandler {
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
    const originInput = document.getElementById("iorigininput");
    const destinationInput = document.getElementById("idestinationinput");
    const modeSelector = document.getElementById("mode-selector");
    // Specify just the place data fields that you need.
    const originAutocomplete = new google.maps.places.Autocomplete(
      originInput,
      { fields: ["place_id"] },
    );
    // Specify just the place data fields that you need.
    const destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput,
      { fields: ["place_id"] },
    );

    
    this.setupPlaceChangedListener(originAutocomplete, "ORIG");
    this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
   originInput.style.display="flex";
   originInput.style.flexdirection="column";
   destinationInput.style.display="flex";
   destinationInput.style.flexdirection="column";
   let iODinput = document.getElementById("iodinput");
   this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(iODinput);
    //this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(originInput);
    //this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(destinationInput,);
  }
  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  setupPlaceChangedListener(autocomplete, mode) {
    autocomplete.bindTo("bounds", this.map);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
	
      if (!place.place_id) {
        window.alert("Please select an option from the dropdown list.");
        return;
      }
	ical();
     // this.route();
    });
  }
}
function icalculateRoute() {
	let request;
	//alert(idirectionsRenderers.length);
	for (let i = 0; i < idirectionsRenderers.length; i++) {
        		idirectionsRenderers[i].setMap(null);
    		}
    		idirectionsRenderers = []; // Clear the array
	iauto.altRenderer = [];
	
	
		request = {
                origin: document.getElementById("iorigininput").value,
	//origin: { lat: latitude, lng: longitude },
                destination:  document.getElementById("idestinationinput").value,
                travelMode: google.maps.TravelMode.DRIVING,
                provideRouteAlternatives : true
            		};
	
            iauto.directionsService.route(request, function (result, status) {
                if (status === google.maps.DirectionsStatus.OK) {
	for(var i=0; i< result.routes.length; i++)
	{
	  iauto.altRenderer = new google.maps.DirectionsRenderer({
                            map: imap,
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
                    const boxes = irouteBoxer.box(path, distance, l);
	//idrawBoxes(boxes);
	ilogBoxCoordinates(boxes);
	idirectionsRenderers.push(iauto.altRenderer);
	}	
                }
            });
        }
 function idrawBoxes(boxes) {
            for (let i = 0; i < boxes.length; i++) {
                new google.maps.Rectangle({
                    bounds: boxes[i],
                    fillColor: "#FF0000",
                    fillOpacity: 0.1,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    map: imap
                });
            }
        }
 function ilogBoxCoordinates(boxes) {
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
function isetsd(id)
{
	iiosource = document.getElementById(id).value;
}
function ichecksd(id)
{
	if(document.getElementById(id).value!=iiosource && document.getElementById(id).value!="")
	{
		document.getElementById(id).value = iiosource;
	}
	else if(document.getElementById(id).value=="")
	{
		ical();
	}
	else
	{
	}
}