let alarmTime = null;
let alarmTimeout = null;
const canvas = document.getElementById("clockCanvas");
const ctx = canvas.getContext("2d");
const enableSound=document.getElementById("enableSound");
const enableVibration=document.getElementById("enableVibration");
const alarmButton = document.getElementById("alarmButton");
const alarmSoundInput = document.getElementById("alarmSoundInput");
const alarmSettings=document.querySelector(".alarm-settings");
let customSound = null;

const images = {};
const digits="0123456789:";
digits.split("").forEach(digit=>{
    let filename = digit === ":" ? "colon.png" : `${digit}.png`
    images[digit]=new Image();
    images[digit].src=`images/${filename}`;
});

function updateClock(){
    const now = new Date();
    const timeString=now.getHours().toString().padStart(2, '0')+':'+
    now.getMinutes().toString().padStart(2,'0')+':'+
    now.getSeconds().toString().padStart(2,'0');
    const dateString = now.getFullYear() + '-' +
    (now.getMonth()+1).toString().padStart(2,'0') + '-' + now.getDate().toString().padStart(2,'0');

    document.getElementById("date").textContent=dateString;

    drawTimeOnCanvas(timeString);

    if(alarmTime&&`${dateString} ${timeString}`===alarmTime){
        document.getElementById("alarmMessage").textContent="Wake up!";
        triggerAlarm();
    }
}

function drawTimeOnCanvas(timeString){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let x=10;
    for(let char of timeString){
        ctx.drawImage(images[char],x,10,40,60);
        x+=45;
    }
}

function toggleAlarm(){
    if(alarmTime){
        cancelAlarm();
    }else{
        setAlarm();
    }
}

function setAlarm(){
    const inputDate=document.getElementById("alarmDate").value;
    const inputTime=document.getElementById("alarmTime").value;
    if(inputDate&&inputTime){
        alarmTime=`${inputDate} ${inputTime}:00`;
        document.getElementById("alarmMessage").textContent=`Alarm setting up in ${inputDate} ${inputTime}`;
        alarmButton.textContent="Cancel Alarm";
        alarmSettings.style.display="none";
    }
}

function cancelAlarm(){
    alarmTime = null;
    document.getElementById("alarmMessage").textContent="Alarm was cancelled";
    if(alarmTimeout){
        clearTimeout(alarmTimeout);
    }
    alarmButton.textContent="Set Alarm";
    alarmSettings.style.display="block";
}

function triggerAlarm(){
    console.log("Alarm!");
    const alarmMessage=document.getElementById("alarmMessage");
    if(alarmMessage){
        alarmMessage.textContent="Wake up!";
        alarmMessage.style.color="red";
    }
    if(enableSound.checked){
        playAlarmSound();
    }
    if(enableVibration.checked&&navigator.vibrate){
        navigator.vibrate([500,300,500]);
    }
    showPopup("Alarm!", "Wake up!");
    cancelAlarm();
}

function playAlarmSound(){
    if(customSound){
        const audio=new Audio(URL.createObjectURL(customSound));
        audio.play();
        alarmTimeout=setTimeout(playAlarmSound,5000);
    }
}

alarmSoundInput.addEventListener("change", function(event){
    customSound=event.target.files[0];
});

function showPopup(title, message){
    const popup=document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML=`
        <div class="popup-content">
            <h2>${title}</h2>
            <p>${message}</p>
            <button id="closePopup">OK</button>
        </div>
    `;
    document.body.appendChild(popup);
    document.getElementById("closePopup").addEventListener("click",()=>{
        popup.remove();
    });
}

setInterval(updateClock,1000);
updateClock();