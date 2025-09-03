// ---------- Tabs ----------
const tabs = document.querySelectorAll(".tab");
const pages = document.querySelectorAll(".page");
tabs.forEach(t => t.addEventListener("click", () => {
  tabs.forEach(x => x.classList.remove("active"));
  pages.forEach(p => p.classList.remove("active"));
  t.classList.add("active");
  document.querySelector(t.dataset.target).classList.add("active");
}));

// ---------- Standard Calculator ----------
const disp = document.getElementById("display");
const hist = document.getElementById("history");
let expression = "0";
let lastAns = 0;
const safeEval = (expr) => {
  expr = expr.replace(/×/g,"*").replace(/÷/g,"/").replace(/--/g,"+");
  expr = expr.replace(/(\d+(?:\.\d+)?)[ ]*%/g, "($1/100)");
  return Function(`'use strict'; return (${expr})`)();
};
function render() { disp.textContent = expression; }
function inputKey(k){
  if (k === "AC"){ expression="0"; hist.textContent=""; render(); return; }
  if (k === "BACK"){ expression = (expression.length>1)? expression.slice(0,-1) : "0"; render(); return; }
  if (k === "="){
    try{
      const value = safeEval(expression);
      const out = Number.isFinite(value) ? +(+value).toFixed(10) : "Error";
      hist.textContent = expression + " =";
      expression = String(out).replace(/\.0+$/,'').replace(/(\.\d*?)0+$/,"$1");
      lastAns = out;
    }catch{ expression="Error"; }
    render(); return;
  }
  if (expression==="0" && /[0-9.]/.test(k)) expression = "";
  if (k==="00") { expression += "00"; render(); return; }
  expression += k;
  render();
}
document.querySelectorAll(".keys [data-key]").forEach(btn=>{
  btn.addEventListener("click", ()=> inputKey(btn.dataset.key));
});
window.addEventListener("keydown",(e)=>{
  const map = {Enter:"=", Backspace:"BACK", Delete:"AC", "*":"*", "/":"/", "+":"+", "-":"-", "%":"%", ".":"."};
  if (/[0-9]/.test(e.key)) inputKey(e.key);
  else if (map[e.key]) inputKey(map[e.key]);
});

// ---------- Panels toggle (Converters & Finance) ----------
function openPanel(id){
  document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
  const el = document.getElementById(`panel-${id}`);
  if (el) el.classList.add("active");
}
document.querySelectorAll(".tile").forEach(t => t.addEventListener("click", ()=> openPanel(t.dataset.open)));

// ---------- Helper: format ----------
const fmt = n => Number(n).toLocaleString(undefined,{maximumFractionDigits:6});

// ---------- Age ----------
document.getElementById("age-calc").addEventListener("click", ()=>{
  const dob = new Date(document.getElementById("age-dob").value);
  if (isNaN(dob)) return document.getElementById("age-out").textContent = "Select date.";
  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();
  if (days < 0){ months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (months < 0){ years--; months += 12; }
  document.getElementById("age-out").textContent = `${years} वर्ष, ${months} माह, ${days} दिन`;
});

// ---------- Date diff ----------
document.getElementById("date-calc").addEventListener("click", ()=>{
  const a = new Date(document.getElementById("date-from").value);
  const b = new Date(document.getElementById("date-to").value);
  if (isNaN(a) || isNaN(b)) return document.getElementById("date-out").textContent = "Select dates.";
  const diff = Math.abs(b - a);
  const days = Math.floor(diff / (1000*60*60*24));
  document.getElementById("date-out").textContent = `${days} दिन`;
});

// ---------- BMI ----------
document.getElementById("bmi-calc").addEventListener("click", ()=>{
  const h = parseFloat(document.getElementById("bmi-h").value)/100;
  const w = parseFloat(document.getElementById("bmi-w").value);
  if (!h || !w) return;
  const bmi = w/(h*h);
  let tag = bmi<18.5?"Underweight":bmi<25?"Normal":bmi<30?"Overweight":"Obese";
  document.getElementById("bmi-out").textContent = `BMI: ${fmt(bmi)} (${tag})`;
});

// ---------- Unit maps ----------
const LEN = { m:1, cm:0.01, mm:0.001, km:1000, in:0.0254, ft:0.3048 };
const MASS = { kg:1, g:0.001, mg:0.000001, lb:0.45359237 };
const SPEED = { mps:1, kmph:1000/3600, mph:1609.344/3600 };
const AREA = { m2:1, cm2:1e-4, ft2:0.09290304, acre:4046.8564224 };
const VOL = { l:0.001, ml:1e-6, m3:1, ft3:0.0283168466 };
const DATA = { B:1, KB:1024, MB:1024**2, GB:1024**3, TB:1024**4 };
function genericConvert(val, from, to, map){
  return val * map[from] / map[to];
}

// Length
document.getElementById("len-calc").addEventListener("click", ()=>{
  const v = +document.getElementById("len-val").value;
  const f = document.getElementById("len-from").value;
  const t = document.getElementById("len-to").value;
  document.getElementById("len-out").textContent = fmt(genericConvert(v,f,t,LEN));
});
// Mass
document.getElementById("mass-calc").addEventListener("click", ()=>{
  const v = +document.getElementById("mass-val").value;
  const f = document.getElementById("mass-from").value;
  const t = document.getElementById("mass-to").value;
  document.getElementById("mass-out").textContent = fmt(genericConvert(v,f,t,MASS));
});
// Temperature
function tConvert(v,f,t){
  let K;
  if (f==="C") K = v + 273.15;
  if (f==="F") K = (v - 32) * 5/9 + 273.15;
  if (f==="K") K = v;
  if (t==="C") return K - 273.15;
  if (t==="F") return (K - 273.15)*9/5 + 32;
  if (t==="K") return K;
}
document.getElementById("t-calc").addEventListener("click", ()=>{
  const v=+document.getElementById("t-val").value;
  const f=document.getElementById("t-from").value, t=document.getElementById("t-to").value;
  document.getElementById("t-out").textContent = fmt(tConvert(v,f,t));
});
// Speed
document.getElementById("s-calc").addEventListener("click", ()=>{
  const v=+document.getElementById("s-val").value;
  const f=document.getElementById("s-from").value, t=document.getElementById("s-to").value;
  document.getElementById("s-out").textContent = fmt(genericConvert(v,f,t,SPEED));
});
// Area
document.getElementById("a-calc").addEventListener("click", ()=>{
  const v=+document.getElementById("a-val").value;
  const f=document.getElementById("a-from").value, t=document.getElementById("a-to").value;
  document.getElementById("a-out").textContent = fmt(genericConvert(v,f,t,AREA));
});
// Volume
document.getElementById("v-calc").addEventListener("click", ()=>{
  const v=+document.getElementById("v-val").value;
  const f=document.getElementById("v-from").value, t=document.getElementById("v-to").value;
  document.getElementById("v-out").textContent = fmt(genericConvert(v,f,t,VOL));
});
// Data
document.getElementById("d-calc").addEventListener("click", ()=>{
  const v=+document.getElementById("d-val").value;
  const f=document.getElementById("d-from").value, t=document.getElementById("d-to").value;
  document.getElementById("d-out").textContent = fmt(genericConvert(v,f,t,DATA));
});

// Numeral systems
function parseByBase(str, base){
  if (base==="DEC") return parseInt(str,10);
  if (base==="BIN") return parseInt(str,2);
  if (base==="OCT") return parseInt(str,8);
  if (base==="HEX") return parseInt(str,16);
}
function formatByBase(num, base){
  if (base==="DEC") return num.toString(10);
  if (base==="BIN") return num.toString(2);
  if (base==="OCT") return num.toString(8);
  if (base==="HEX") return num.toString(16).toUpperCase();
}
document.getElementById("num-calc").addEventListener("click", ()=>{
  const input = document.getElementById("num-in").value.trim();
  const from = document.getElementById("num-from").value;
  const to = document.getElementById("num-to").value;
  const n = parseByBase(input, from);
  if (isNaN(n)) return document.getElementById("num-out").textContent = "Invalid number.";
  document.getElementById("num-out").textContent = formatByBase(n, to);
});

// ---------- Finance ----------
// Currency (manual rate)
document.getElementById("cur-calc").addEventListener("click", ()=>{
  const amt=+document.getElementById("cur-amt").value;
  const rate=+document.getElementById("cur-rate").value;
  const from=document.getElementById("cur-from").value.toUpperCase();
  const to=document.getElementById("cur-to").value.toUpperCase();
  if (!amt || !rate) return;
  document.getElementById("cur-out").textContent = `${from} ${fmt(amt)} = ${to} ${fmt(amt*rate)}`;
});
// GST
document.getElementById("gst-calc").addEventListener("click", ()=>{
  const base=+document.getElementById("gst-base").value;
  const rate=+document.getElementById("gst-rate").value;
  const tax = base * rate / 100;
  document.getElementById("gst-out").textContent = `GST: ${fmt(tax)} | Total: ${fmt(base+tax)}`;
});
// Investment
document.getElementById("inv-simple").addEventListener("click", ()=>{
  const P=+document.getElementById("inv-p").value, r=+document.getElementById("inv-r").value/100, y=+document.getElementById("inv-n").value;
  const A = P*(1 + r*y);
  document.getElementById("inv-out").textContent = `Maturity: ${fmt(A)} | Interest: ${fmt(A-P)}`;
});
document.getElementById("inv-comp").addEventListener("click", ()=>{
  const P=+document.getElementById("inv-p").value, r=+document.getElementById("inv-r").value/100, y=+document.getElementById("inv-n").value;
  const A = P*Math.pow(1+r, y);
  document.getElementById("inv-out").textContent = `Maturity: ${fmt(A)} | Interest: ${fmt(A-P)}`;
});
document.getElementById("inv-sip").addEventListener("click", ()=>{
  const P=+document.getElementById("inv-p").value, r=+document.getElementById("inv-r").value/100/12, m=+document.getElementById("inv-n").value*12;
  const A = P * ((Math.pow(1+r, m)-1)/r) * (1+r);
  document.getElementById("inv-out").textContent = `Maturity: ${fmt(A)} | Invested: ${fmt(P*m)} | Gain: ${fmt(A - P*m)}`;
});
// Loan EMI
document.getElementById("emi-calc").addEventListener("click", ()=>{
  const P=+document.getElementById("emi-p").value, i=+document.getElementById("emi-r").value/100/12, n=+document.getElementById("emi-n").value;
  const EMI = (P*i*Math.pow(1+i,n)) / (Math.pow(1+i,n)-1);
  const total = EMI*n, interest = total - P;
  document.getElementById("emi-out").textContent = `EMI: ${fmt(EMI)} | Total: ${fmt(total)} | Interest: ${fmt(interest)}`;
});
// Discount
document.getElementById("disc-calc").addEventListener("click", ()=>{
  const mrp=+document.getElementById("disc-mrp").value, off=+document.getElementById("disc-off").value;
  const save = mrp*off/100, pay = mrp - save;
  document.getElementById("disc-out").textContent = `Save: ${fmt(save)} | Payable: ${fmt(pay)}`;
});

