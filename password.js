const inputslider=document.querySelector("[data-length-slider]");
const lengthdisplay=document.querySelector("[data-lengthnumber]");
const passworddisplay=document.querySelector("[data-password-display]");
const copybtn=document.querySelector("[data-copy]");
const copymsg=document.querySelector("[data-copymsg]");
const uppercasecheck=document.querySelector("#uppercase");
const lowercasecheck=document.querySelector("#lowercase");
const numberscheck=document.querySelector("#numbers");
const symbolscheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generatebtn=document.querySelector(".generate-button");
const allcheckbox=document.querySelectorAll("input[type=checkbox]");
const symbols='!@#$%^&*()_+{}|:"<>?';

let password="";
let passwordlength=10;
let checkcount=0;
handleSlider();

function handleSlider(){
    inputslider.value=passwordlength;
    lengthdisplay.textContent=passwordlength;
}

function setindicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}
function getrndinteger(min,max){
   return Math.floor(Math.random()*(max-min))+min;
}

function getrandomnumber(){ 
    return getrndinteger(0,9);
}

function generatelowercase(){
    return String.fromCharCode(getrndinteger(97,123));
}

function generateuppercase(){
    return String.fromCharCode(getrndinteger(65,91));
}

function generatesymbol(){
    const randnum=getrndinteger(0,symbols.length);
    return symbols.charAt(randnum);
}

function calcStrength() {
    let hasUpper = uppercasecheck.checked;
    let hasLower = lowercasecheck.checked;
    let hasNum = numberscheck.checked;
    let hasSym = symbolscheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
        setindicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordlength >= 6
    ) {
        setindicator("#ff0"); 
    } else {
        setindicator("#f00"); 
    }
}

async function copycontent() {
    try {
        await navigator.clipboard.writeText(passworddisplay.value);
        copymsg.textContent = "Copied!";
    } catch (e) {
        copymsg.textContent = "Failed";
    }

    copymsg.classList.add('active');

    setTimeout(() => {
        copymsg.textContent = "";
        copymsg.classList.remove('active');
    }, 1000);
}

   
inputslider.addEventListener('input',(e)=>{
    passwordlength=Number(e.target.value);
    handleSlider();
});

copybtn.addEventListener('click',()=>{
    if(passworddisplay.value){
        copycontent();
    }
});

function handlecheckboxchange(){
    checkcount=0;
    allcheckbox.forEach(
        (checkbox)=>{
            if(checkbox.checked){checkcount++;}
        }
    );
    if(passwordlength<checkcount){
        passwordlength=checkcount;
        handleSlider();
    }
}
allcheckbox.forEach(
    (checkbox)=>{
        checkbox.addEventListener('change',handlecheckboxchange);
    }
)

generatebtn.addEventListener('click',()=>{
    //none of the checkbox are selected.
    if(checkcount<=0) return;

    if(passwordlength<checkcount){
        passwordlength=checkcount; handleSlider();
    }
    password="";
    let funcarr=[];
    if(uppercasecheck.checked){
        funcarr.push(generateuppercase);
    }
    if(lowercasecheck.checked){
        funcarr.push(generatelowercase);
    }
    if(numberscheck.checked){
        funcarr.push(getrandomnumber);
    }
    if(symbolscheck.checked){
        funcarr.push(generatesymbol);
    }
    for(let i=0;i<funcarr.length;i++){
        password+=funcarr[i]();
    }
    for(let i=0;i<passwordlength-funcarr.length;i++){
        let randind=getrndinteger(0,funcarr.length);
        password+=funcarr[randind]();
    }
    
    passworddisplay.value=password;
    calcStrength();
});



