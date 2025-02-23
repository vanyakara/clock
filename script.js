let alarmTime = null;
let alarmTimeout = null;
const canvas = document.getElementById("clockCanvas");
const ctx = canvas.getContext("2d");
const enableSound=document.getElementById("enableSound");
const enableVibration=document.getElementById("enableVibration");

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
    const dateString = now.getDate().toString().padStart(2,'0')+'.'+
    (now.getMonth()+1).toString().padStart(2,'0')+'.'+now.getFullYear();

    document.getElementById("date").textContent=dateString;

    drawTimeOnCanvas(timeString);

    if(alarmTime&&timeString===alarmTime){
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

function setAlarm(){
    const inputTime=document.getElementById("alarmTime").value;
    if(inputTime){
        alarmTime=inputTime+":00";
        document.getElementById("alarmMessage").textContent="Alarm setting up in "+inputTime;
    }
}

function triggerAlarm(){
    if(enableSound.checked){
        playAlarmSound();
    }
    if(enableVibration.checked&&navigator.vibrate){
        navigator.vibrate([500,300,500]);
    }
}

function playAlarmSound(){
    const audio=new Audio("alarm.mp3");
    audio.play();
    alarmTimeout=setTimeout(playAlarm,5000);
}

setInterval(updateClock,1000);
updateClock();