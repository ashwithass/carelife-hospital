/* ======================= DISEASE → MEDICINE DATA (45+) ======================= */

const diseaseMedicineMap = {

"fever":[
 {name:"Paracetamol", qty:"500mg – 1 tablet", price:"₹10", tips:"Take 3 times a day after food"},
 {name:"Ibuprofen", qty:"400mg – 1 tablet", price:"₹12", tips:"Take 2 times a day after food"}
],

"cold":[
 {name:"Cetirizine", qty:"10mg – 1 tablet", price:"₹8", tips:"Take at night"},
 {name:"Sinarest", qty:"1 tablet", price:"₹15", tips:"Take 2 times a day after food"}
],

"cough":[
 {name:"Benadryl Syrup", qty:"10ml", price:"₹60", tips:"Take 3 times a day after food"}
],

"headache":[
 {name:"Paracetamol", qty:"500mg – 1 tablet", price:"₹10", tips:"Take when pain occurs"},
 {name:"Disprin", qty:"1 tablet", price:"₹6", tips:"Take after food"}
],

"migraine":[
 {name:"Sumatriptan", qty:"50mg – 1 tablet", price:"₹40", tips:"Take when migraine starts"}
],

"thyroid":[
 {name:"Levothyroxine", qty:"1 tablet", price:"₹5", tips:"Take in morning before food with water"},
 {name:"Liothyronine", qty:"1 tablet", price:"₹7", tips:"Take once daily after breakfast"}
],

"diabetes":[
 {name:"Metformin", qty:"500mg – 1 tablet", price:"₹9", tips:"Take 2 times a day after food"},
 {name:"Glibenclamide", qty:"5mg – 1 tablet", price:"₹11", tips:"Take before breakfast"}
],

"bp":[
 {name:"Amlodipine", qty:"5mg – 1 tablet", price:"₹8", tips:"Take once daily after food"},
 {name:"Losartan", qty:"50mg – 1 tablet", price:"₹13", tips:"Take once daily"}
],

"anemia":[
 {name:"Ferrous Sulfate", qty:"1 tablet", price:"₹6", tips:"Take daily after food"},
 {name:"Folic Acid", qty:"1 tablet", price:"₹4", tips:"Take daily"}
],

"asthma":[
 {name:"Salbutamol Inhaler", qty:"2 puffs", price:"₹120", tips:"Use when breathing difficulty occurs"}
],

"allergy":[
 {name:"Cetirizine", qty:"10mg – 1 tablet", price:"₹8", tips:"Take once daily at night"},
 {name:"Loratadine", qty:"10mg – 1 tablet", price:"₹10", tips:"Take once daily"}
],

"vomiting":[
 {name:"Ondansetron", qty:"4mg – 1 tablet", price:"₹14", tips:"Take 2 times a day"}
],

"diarrhea":[
 {name:"ORS", qty:"1 glass", price:"₹20", tips:"Drink after every loose motion"},
 {name:"Loperamide", qty:"2mg – 1 tablet", price:"₹9", tips:"Take after loose motion"}
],

"gastritis":[
 {name:"Pantoprazole", qty:"40mg – 1 tablet", price:"₹12", tips:"Take before food in morning"},
 {name:"Gelusil", qty:"10ml", price:"₹30", tips:"Take after food"}
],

"ulcer":[
 {name:"Omeprazole", qty:"20mg – 1 tablet", price:"₹10", tips:"Take before food"}
],

"arthritis":[
 {name:"Diclofenac", qty:"50mg – 1 tablet", price:"₹11", tips:"Take 2 times a day after food"}
],

"back pain":[
 {name:"Ibuprofen", qty:"400mg – 1 tablet", price:"₹12", tips:"Take 2 times a day"}
],

"skin infection":[
 {name:"Clotrimazole Cream", qty:"Apply small amount", price:"₹55", tips:"Apply 2 times a day"}
],

"fungal infection":[
 {name:"Ketoconazole Cream", qty:"Apply small amount", price:"₹60", tips:"Apply 2 times daily"}
],

"eye infection":[
 {name:"Ciplox Drops", qty:"2 drops", price:"₹45", tips:"Use 3 times a day"}
],

"ear pain":[
 {name:"Otipax Drops", qty:"2 drops", price:"₹50", tips:"Use 2 times a day"}
],

"tooth pain":[
 {name:"Meftal Forte", qty:"1 tablet", price:"₹13", tips:"Take 2 times a day"}
],

"urine infection":[
 {name:"Ciprofloxacin", qty:"500mg – 1 tablet", price:"₹16", tips:"Take 2 times daily"}
],

"kidney stone":[
 {name:"Cystone", qty:"2 tablets", price:"₹70", tips:"Take 2 times daily with water"}
],

"heartburn":[
 {name:"Rantac", qty:"150mg – 1 tablet", price:"₹9", tips:"Take 2 times a day"}
],

"constipation":[
 {name:"Cremaffin", qty:"10ml", price:"₹45", tips:"Take at night before sleep"}
],

"depression":[
 {name:"Sertraline", qty:"50mg – 1 tablet", price:"₹18", tips:"Take once daily"}
],

"anxiety":[
 {name:"Alprazolam", qty:"0.25mg – 1 tablet", price:"₹7", tips:"Take at night"}
],

"insomnia":[
 {name:"Zolpidem", qty:"5mg – 1 tablet", price:"₹14", tips:"Take before bedtime"}
],

"pcod":[
 {name:"Metformin", qty:"500mg – 1 tablet", price:"₹9", tips:"Take 2 times daily"}
],

"pregnancy":[
 {name:"Folic Acid", qty:"1 tablet", price:"₹4", tips:"Take daily after food"},
 {name:"Iron Tablet", qty:"1 tablet", price:"₹6", tips:"Take daily"}
],

"vitamin deficiency":[
 {name:"Becadexamin", qty:"1 capsule", price:"₹12", tips:"Take daily after food"}
],

"malaria":[
 {name:"Lariago", qty:"1 tablet", price:"₹20", tips:"Take as prescribed"}
],

"dengue":[
 {name:"Paracetamol", qty:"500mg – 1 tablet", price:"₹10", tips:"Take for fever"},
 {name:"ORS", qty:"1 glass", price:"₹20", tips:"Drink frequently"}
],

"typhoid":[
 {name:"Azithromycin", qty:"500mg – 1 tablet", price:"₹22", tips:"Take once daily after food"}
],

"cholesterol":[
 {name:"Atorvastatin", qty:"10mg – 1 tablet", price:"₹15", tips:"Take at night"}
],

"obesity":[
 {name:"Orlistat", qty:"120mg – 1 tablet", price:"₹25", tips:"Take before meals"}
],

"acne":[
 {name:"Clindamycin Gel", qty:"Apply small amount", price:"₹55", tips:"Apply 2 times daily"}
],

"stomach pain":[
 {name:"Drotin", qty:"1 tablet", price:"₹10", tips:"Take 2 times daily after food"}
]
};


/* ======================= ALIASES ======================= */

const diseaseAliases = {
"high bp":"bp",
"blood pressure":"bp",
"sugar":"diabetes",
"high sugar":"diabetes",
"thy":"thyroid",
"gas problem":"gastritis",
"loose motion":"diarrhea",
"pcos":"pcod"
};


/* ======================= (rest of your file unchanged) ======================= */

function similarity(a,b){
 let longer=a.length>b.length?a:b;
 let shorter=a.length>b.length?b:a;
 return (longer.length-editDistance(longer,shorter))/longer.length;
}

function editDistance(a,b){
 const dp=Array(a.length+1).fill().map(()=>Array(b.length+1).fill(0));
 for(let i=0;i<=a.length;i++) dp[i][0]=i;
 for(let j=0;j<=b.length;j++) dp[0][j]=j;
 for(let i=1;i<=a.length;i++){
  for(let j=1;j<=b.length;j++){
   dp[i][j]=a[i-1]==b[j-1]?dp[i-1][j-1]:
   Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])+1;
  }
 }
 return dp[a.length][b.length];
}

function detectDisease(input){
 input=input.toLowerCase().trim();
 if(diseaseMedicineMap[input]) return input;
 if(diseaseAliases[input]) return diseaseAliases[input];
 for(let key in diseaseMedicineMap){
  if(key.includes(input)) return key;
 }
 let best=null,score=0;
 for(let key in diseaseMedicineMap){
  let s=similarity(input,key);
  if(s>score){score=s;best=key;}
 }
 if(score>0.5) return best;
 return null;
}

function loadMedicinesForDisease(disease){
 const box=document.getElementById("autoMedicineList");
 box.innerHTML="";

 diseaseMedicineMap[disease].forEach(m=>{
  const div=document.createElement("div");
  div.className="auto-item";

  div.innerHTML=`<b>${m.name}</b><br><small>${m.qty} — ${m.tips} — ${m.price}</small>`;

  div.onclick=()=>{
    document.getElementById("med").value = m.name;
    document.getElementById("qty").value = m.qty;
    document.getElementById("price").value = m.price;
    document.getElementById("tips").value = m.tips;
  };

  box.appendChild(div);
 });
}
