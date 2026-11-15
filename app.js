// AGAA-MATH starter content. Replace/add topics, YouTube playlist ID and worksheet links here.
const CHANNEL_URL = "https://www.youtube.com/@agaamath";
const YOUTUBE_PLAYLIST_ID = "PLrEgewX8HhryUCBdki2i613LtOI1ikD-S";
const GRADE_TOPICS = {
  1:["Counting","Addition","Subtraction","Shapes"],
  2:["Place Value","Addition & Subtraction","Measurement","Time"],
  3:["Multiplication","Division","Fractions","Geometry"],
  4:["Large Numbers","Factors & Multiples","Fractions","Perimeter"],
  5:["Decimals","Fractions","Factors & Multiples","Geometry"],
  6:["Integers","Ratio","Algebra Basics","Data Handling"],
  7:["Rational Numbers","Linear Equations","Percentages","Geometry"],
  8:["Squares & Cubes","Algebraic Expressions","Mensuration","Graphs"],
  9:["Number Systems","Polynomials","Coordinate Geometry","Geometry"],
  10:["Real Numbers","Quadratic Equations","Trigonometry","Probability"],
  11:["Sets","Functions","Sequences & Series","Coordinate Geometry"],
  12:["Matrices","Calculus","Vectors","Probability"]
};

const WORKSHEETS = [
  {title:"Grade 1 Mathematics Worksheet",url:"worksheets/grade-1-mathematics-worksheet.pdf",grade:1},
  {title:"Grade 2 Mathematics Worksheet",url:"worksheets/grade-2-mathematics-worksheet.pdf",grade:2},
  {title:"Grade 3 Mathematics Worksheet",url:"worksheets/grade-3-mathematics-worksheet.pdf",grade:3},
  {title:"Grade 4 Mathematics Worksheet",url:"worksheets/grade-4-mathematics-worksheet.pdf",grade:4},
  {title:"Grade 5 Mathematics Worksheet",url:"worksheets/grade-5-mathematics-worksheet.pdf",grade:5},
  {title:"Grade 6 Mathematics Worksheet",url:"worksheets/grade-6-mathematics-worksheet.pdf",grade:6},
  {title:"Grade 7 Mathematics Worksheet",url:"worksheets/grade-7-mathematics-worksheet.pdf",grade:7},
  {title:"Grade 8 Mathematics Worksheet",url:"worksheets/grade-8-mathematics-worksheet.pdf",grade:8},
  {title:"Grade 9 Mathematics Worksheet",url:"worksheets/grade-9-mathematics-worksheet.pdf",grade:9},
  {title:"Grade 10 Mathematics Worksheet",url:"worksheets/grade-10-mathematics-worksheet.pdf",grade:10}
];

const QUESTIONS = [
 {q:"What is 25% of 200?",a:["25","40","50","75"],correct:2,why:"25% = 1/4, and 200 ÷ 4 = 50."},
 {q:"What is the value of 7 × 8?",a:["54","56","64","48"],correct:1,why:"7 multiplied by 8 equals 56."},
 {q:"Which is the smallest prime number?",a:["0","1","2","3"],correct:2,why:"2 is the smallest prime number and the only even prime."},
 {q:"What is the perimeter of a square with side 5 cm?",a:["10 cm","15 cm","20 cm","25 cm"],correct:2,why:"Perimeter = 4 × side = 4 × 5 = 20 cm."},
 {q:"What is 3/4 expressed as a percentage?",a:["25%","50%","75%","80%"],correct:2,why:"3/4 × 100 = 75%."}
];
const $ = id => document.getElementById(id);
$("year").textContent = new Date().getFullYear();
$("menuButton").addEventListener("click",()=>$("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>$("mainNav").classList.remove("open")));

const gradeGrid=$("gradeGrid");
Object.keys(GRADE_TOPICS).forEach(g=>{
 const b=document.createElement("button"); b.className="grade"; b.innerHTML=`<b>${g}</b><small>GRADE</small>`;
 b.addEventListener("click",()=>{
  document.querySelectorAll(".grade").forEach(x=>x.classList.remove("active"));b.classList.add("active");
  const panel=$("topicPanel")||document.createElement("div");panel.id="topicPanel";panel.className="topic-panel show";
  panel.innerHTML=`<h3>Grade ${g} – Mathematics topics</h3><div class="topic-chips">${GRADE_TOPICS[g].map(t=>`<span class="chip">${t}</span>`).join("")}</div>`;
  gradeGrid.after(panel);
 }); gradeGrid.appendChild(b);
});
if(YOUTUBE_PLAYLIST_ID){
 const placeholder=document.querySelector(".embed-placeholder");
 placeholder.innerHTML=`<iframe title="AGAA-MATH YouTube playlist" width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(YOUTUBE_PLAYLIST_ID)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
}
if(WORKSHEETS.length){
 $("worksheetList").innerHTML=WORKSHEETS.map(w=>`<div class="worksheet-item"><b>${w.title}</b><a class="text-link" href="${w.url}" target="_blank" rel="noopener">Open PDF ↗</a></div>`).join("");
}
let qi=0,score=0,answered=false;
function showQuestion(){
 const q=QUESTIONS[qi];answered=false;$("questionCount").textContent=`Question ${qi+1} of ${QUESTIONS.length}`;$("score").textContent=`Score: ${score}`;
 $("questionText").textContent=q.q;$("answers").innerHTML="";$("feedback").textContent="";$("nextQuestion").disabled=true;
 $("progressBar").style.width=`${(qi/QUESTIONS.length)*100}%`;
 q.a.forEach((v,i)=>{const b=document.createElement("button");b.className="answer";b.textContent=v;b.addEventListener("click",()=>choose(i,b));$("answers").appendChild(b)});
}
function choose(i,button){if(answered)return;answered=true;const q=QUESTIONS[qi];[...$("answers").children].forEach((b,j)=>{b.disabled=true;if(j===q.correct)b.classList.add("correct")});if(i===q.correct){score++;$("feedback").textContent="Correct! "+q.why}else{button.classList.add("wrong");$("feedback").textContent="Not quite. "+q.why}$("score").textContent=`Score: ${score}`;$("nextQuestion").disabled=false}
$("nextQuestion").addEventListener("click",()=>{if(qi<QUESTIONS.length-1){qi++;showQuestion()}else{$("questionText").textContent=`Quiz complete! You scored ${score} out of ${QUESTIONS.length}.`;$("answers").innerHTML="";$("feedback").textContent="Keep practising and try again.";$("nextQuestion").disabled=true;$("progressBar").style.width="100%";$("questionCount").textContent="Completed"}});
$("restartQuiz").addEventListener("click",()=>{qi=0;score=0;showQuestion()});showQuestion();

let expression="",fresh=true;
function display(v){$("calcDisplay").textContent=v}
$("calcKeys").addEventListener("click",e=>{const key=e.target.dataset.key;if(!key)return;if(key==="C"){expression="";fresh=true;display("0");return}if(key==="="){try{if(!/^[0-9+\-*/. ()]+$/.test(expression))throw Error();const result=Function('"use strict";return ('+expression+')')();if(!Number.isFinite(result))throw Error();expression=String(Number(result.toFixed(10)));display(expression);fresh=true}catch{display("Error");expression="";fresh=true}return}if(fresh&&/[0-9.]/.test(key))expression="";expression+=key;display(expression);fresh=false});
