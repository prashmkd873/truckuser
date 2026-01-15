let state = ["Gujarat"];
let destict = ["Gujarat-Rajkot", "Gujarat-Junagadh"];
let regionss = ["Gujarat-Rajkot-Ribda", "Gujarat-Rajkot-Shapar", "Gujarat-Junagadh-keshod"];
let statelist = ["Andaman and Nicobar Islands",
"Andhra Pradesh", 
"Arunachal Pradesh", 
"Assam", 
"Bihar", 
"Chandigarh", 
"Chhattisgarh", 
"Dadra and Nagar Haveli", 
"Daman and Diu", 
"Delhi", 
"Goa", 
"Gujarat",  
"Haryana", 
"Himachal Pradesh", 
"Jammu and Kashmir",  
"Jharkhand", 
"Karnataka", 
"Kerala", 
"Ladakh", 
"Lakshadweep",  
"Madhya Pradesh",  
"Maharashtra", 
"Manipur", 
"Meghalaya",  
"Mizoram", 
"Nagaland", 
"Odisha", 
"Puducherry",  
"Punjab", 
"Rajasthan",  
"Sikkim", 
"Tamil Nadu",  
"Telangana", 
"Tripura", 
"Uttar Pradesh",  
"Uttarakhand", 
"West Bengal" ];

let distlist = ["Ahmedabad", 
"Amreli", 
"Anand", 
"Arvalli", 
"Banas Kantha", 
"Bharuch", 
"Bhavnagar", 
"Botad", 
"Chhotaudepur", 
"Dahod", 
"Dangs", 
"Devbhumi Dwarka",
"Gandhinagar",
"Gir Somnath", 
"Jamnagar", 
"Junagadh", 
"Kachchh", 
"Kheda", 
"Mahesana", 
"Mahisagar", 
"Morbi", 
"Narmada", 
"Navsari", 
"Panch Mahals", 
"Patan", 
"Porbandar", 
"Rajkot", 
"Sabar Kantha", 
"Surat", 
"Surendranagar", 
"Tapi", 
"Vadodara", 
"Valsad" ];
let selectdist;
let selectstate;
      function initialize() {  
        const input = document.getElementById("autocomplete");
        const service = new google.maps.places.AutocompleteService();
        const suggestions = document.getElementById("suggestions");
        const placesService = new google.maps.places.PlacesService(document.createElement("div"));
       
        input.addEventListener('input', function () {
	
       //alert("hi");
    const value = input.value;
    if (!value) {
      suggestionsBox.innerHTML = "";
      //return;
    }

    service.getPlacePredictions(
            { input: value,
               types: ["(regions)"],
          componentRestrictions: { country: "in" },
            }, (predictions, status) => {
      suggestions.innerHTML = "";
      if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) 
	{return;}
      predictions.forEach(prediction => {
        const div = document.createElement('div');
         const mainText = prediction.structured_formatting.main_text;   // Place name
         const secondaryText = prediction.structured_formatting.secondary_text; // Address
          if(secondaryText.includes(selectstate) && !regionss.includes(selectstate+"-"+selectdist+"-"+mainText))
          {
              
              //alert(place);
              placesService.getDetails({ placeId: prediction.place_id }, (place, status) => {
          if (status != google.maps.places.PlacesServiceStatus.OK) { return; }
          
          let district = "";
          let i=0;
                  
          place.address_components.forEach((component) => {
              //alert(component.types);
            if (component.types.includes("administrative_area_level_3")) {
              
              district = component.long_name;
              //alert(district);
                if(district.includes(selectdist)){i=1;}
            }
          });
              
              //alert(i);
             if(i==1)
              {
    div.innerHTML = "<img src='Live img.png' style='height:5%;width:5%;float:left;padding:5px;'><div style='font-weight:420;font-size:16px;float:left;width:90%;padding-top:2px;'>"+mainText+"</div><div style='font-size:14px; color: #555;border-bottom: 1px solid black;float:right;width:96%;padding-left:10px;'>"+secondaryText+"</div>";
        div.addEventListener('click', () => {
          input.value = prediction.description;
          suggestions.innerHTML = "";
          regionss.push(selectstate+"-"+selectdist+"-"+mainText);
          displayradarsearch();
          //alert(regionss);
          dropdownregin.style.display="none";
          // You can now use PlacesService to get full details if needed
        });
        suggestions.appendChild(div);
             }
             });
          }
      });
    });
  }); 
}
function displayradarsearch()
{
	
	
	
	let radarsearchlist = document.getElementById("radarsearchlist");
	//radarsearchlist.innerHTML ="";
	let first="";
	for(let i=0; i < state.length; i++)
	{
	let second="";
	first = first+"<div style='border:1.5px solid orange;width:99%;min-height:125px;margin:5px auto 5px auto;'><div style='background:white;width:100%;float:left;text-align:center;padding:2px 0px 2px 0px;'>"+ state[i] +"<button style='width:10%;float:left;border:none;background:white;' data-name='"+state[i]+"' onclick='stateminus(this.dataset.name)'>-</button><button style='width:10%;float:right;border:none;background:white;' data-name='"+state[i]+"' onClick='distplus(this.dataset.name)'>+</button></div>";
	for(let j=0; j< destict.length; j++)
	{
		if(destict[j].includes(state[i]))
		{
			const partd = destict[j].split("-");
			second =  second+"<div style='border:1.5px solid gray;width:97%;height:90px;margin:25px auto 5px auto;'><div style='background:gray;width:100%;float:left;text-align:center;padding:2px 0px 2px 0px;color:white;font-weight:600;'>"+partd[1]+"<button style='width:10%;float:left;border:none;background:gray;color:white;' data-name='"+destict[j]+"' onclick='distminus(this.dataset.name)'>-</button><button style='width:10%;float:right;border:none;background:gray;color:white;' data-name='"+partd[1]+"' data-state='"+state[i]+"' onclick='regionplus(this.dataset.name, this.dataset.state)'>+</button></div>";
			let third="";
			for(let k=0; k<regionss.length; k++)
			{
				if(regionss[k].includes(destict[j]))
				{
				const partr = regionss[k].split("-");
				third = third + "<div style='float:left;background:lightblue;border-radius:10px;margin:2px 5px 2px 5px;padding:2px 5px 2px 5px;' >"+partr[2]+"<button style='border:none;background:lightblue;' data-name='"+regionss[k]+"' onclick='regionminus(this.dataset.name)'> --</button></div>";
				}
			}
			second=second+third+"</div>";
		}
	}
	first=first+second+"</div>";
	}
	radarsearchlist.innerHTML = first;
	//alert(radarsearchlist.innerHTML);
}
let dropdowndist = document.getElementById("distdrop");
let dropdownstate = document.getElementById("statedrop");
let dropdownregin = document.getElementById("regindrop");
      function distplus(name)
      {
 	dropdowndist.style.display="block";
	dropdowndist.innerHTML="<button id='backdist'>Back</button>DISTRICT";  
	document.getElementById("backdist").onclick = function(){ dropdowndist.style.display="none"; };
	selectstate = name;
	//alert(selectstate);
	if(selectstate == "Gujarat")
	{
	distlist.forEach(function(item) {
	if(!destict.includes(selectstate+"-"+item))
	{
    	const option = document.createElement('div');
    	option.innerHTML = item;
	option.style="border-bottom:1px solid gray;padding:5px 5px 5px 5px;";
                  //alert(option.innerHTML);
	option.addEventListener("click",
	   function()
	   {
	      selectdist = this.innerHTML;
	      destict.push(selectstate+"-"+selectdist);
	      //alert(destict);
	      dropdowndist.style.display="none";
		displayradarsearch();
	   });
    	dropdowndist.appendChild(option);
	}
	});
	}
	else
	{
	}
	//alert(selectdist); 
       }
        function stateplus()
      {
dropdownstate.style.display="block";
dropdownstate.innerHTML="<button id='backstate'>Back</button>STATE";  
document.getElementById("backstate").onclick = function(){ dropdownstate.style.display="none"; };
 statelist.forEach(function(item) {
   if(!state.includes(item))
    {
    const option = document.createElement('div');
    option.style="border-bottom:1px solid gray;padding:5px 5px 5px 5px;";
    option.innerHTML = item;
    option.addEventListener("click",
	   function()
	   {
	      selectstate = this.innerHTML;
	      state.push(selectstate);
	      //alert(state);
	      dropdownstate.style.display="none";
		displayradarsearch();
	   });
    dropdownstate.appendChild(option);
    }
});
      }
function regionplus(name, state)
{
	//dropdownregin.innerHTML=""; 
	document.getElementById("backregion").onclick = function(){ dropdownregin.style.display="none"; };
	document.getElementById("autocomplete").value="";
	selectdist = name;
	selectstate = state;
	//alert(name+"/"+state);
 	dropdownregin.style.display="block";
}
function distminus(name)
{

for(let i=0;i<destict.length; i++)
{
	
	if(destict[i].includes(name))
	{
		destict.splice(i, 1);
		//alert(destict);
		i = i-1;
	}
}
for(let i=0;i<regionss.length; i++)
{
	
	if(regionss[i].includes(name))
	{
		regionss.splice(i, 1);
		i = i-1;
	}
}
displayradarsearch();
}
function stateminus(name)
{
for(let i=0;i<state.length; i++)
{
	
	if(state[i].includes(name))
	{
		state.splice(i, 1);
		//alert(destict);
		i = i-1;
	}
}
for(let i=0;i<destict.length; i++)
{
	
	if(destict[i].includes(name))
	{
		destict.splice(i, 1);
		//alert(destict);
		i = i-1;
	}
}
for(let i=0;i<regionss.length; i++)
{
	
	if(regionss[i].includes(name))
	{
		regionss.splice(i, 1);
		i = i-1;
	}
}
displayradarsearch();
}
function regionminus(name)
{
for(let i=0;i<regionss.length; i++)
{
	
	if(regionss[i].includes(name))
	{
		regionss.splice(i, 1);
		i = i-1;
	}
}
displayradarsearch();
}
initialize();