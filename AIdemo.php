<button id="back" onClick="displayhome();">back</button>AI demo 
<h1>Googji Assistent</h1>
<audio id="audio" autoplay>
      <source src="nosound.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
YOU :<p id="output"></p>
GOOGJI :<p id="ai"></p>         
<div id="result"></div>          
<img onclick="speakText(document.getElementById('ai').innerText);" style= "position:fixed;bottom:2%;right:2%;width:10%;height:7%;border-radius:50%;background:black;padding:10px 10px 10px 10px;" src="">
          
<img onclick="startListening()" style= "position:fixed;bottom:5%;right:37%;width:15%;height:10%;border-radius:50%;background:lightgray;padding:20px 20px 20px 20px;" src="micro.png">


