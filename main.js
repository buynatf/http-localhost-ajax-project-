/* main.js */

/* AJAX */
function makerequest(page,id){
  var xhr=new XMLHttpRequest();
  xhr.open("GET",page,true);
  xhr.onreadystatechange=function(){
    if(xhr.readyState==4 && xhr.status==200){
      document.getElementById(id).innerHTML=xhr.responseText;
    }
  }
  xhr.send();
}

/* LOGIN */
function login(role){
  let inputs=document.querySelectorAll("#content input");
  let username=inputs[0].value;
  let password=inputs[1].value;

  if(username==""||password==""){
    alert("Бөглөнө үү");
    return;
  }

  let user={username,role,image:null};
  localStorage.setItem("currentUser",JSON.stringify(user));
  loadProfile();
}

function checkLogin(){
  let user=JSON.parse(localStorage.getItem("currentUser"));
  if(user) loadProfile();
}

function logout(){
  localStorage.removeItem("currentUser");
  makerequest('page1.html','content');
}

/* PROFILE */
function loadProfile(){
  let user=JSON.parse(localStorage.getItem("currentUser"));

  let dashboard=getDashboard(user.role);

  document.getElementById("content").innerHTML=`
    <h2>👤 Profile</h2>

    <img src="${user.image||'https://via.placeholder.com/120'}"
    style="width:120px;height:120px;border-radius:50%"><br>

    <input type="file" onchange="uploadImage(event)"><br>

    <p>${user.username}</p>
    <p>${user.role}</p>

    <hr>

    ${dashboard}

    <button onclick="logout()">Гарах</button>
  `;
}

/* IMAGE */
function uploadImage(e){
  let file=e.target.files[0];
  let reader=new FileReader();

  reader.onload=function(ev){
    let user=JSON.parse(localStorage.getItem("currentUser"));
    user.image=ev.target.result;
    localStorage.setItem("currentUser",JSON.stringify(user));
    loadProfile();
  }

  reader.readAsDataURL(file);
}

/* DASHBOARD */
function getDashboard(role){
  if(role==="Оюутан"){
    return `<h3>📚 Оюутан</h3><p>Даалгавар, хичээл</p>`;
  }
  if(role==="Багш"){
    return `<h3>👨‍🏫 Багш</h3><p>Дүн оруулах</p>`;
  }
  if(role==="Сургалтын алба"){
    return `<h3>🏢 Алба</h3><p>Систем удирдах</p>`;
  }
}

/* CALENDAR */
function showHideCalendar(){
  let box=document.getElementById("calendarBox");
  if(box.innerHTML=="") loadCalendar();
  else box.innerHTML="";
}

function loadCalendar(month="",year=""){
  let url="calendar.php";
  if(month!="") url+="?month="+month+"&year="+year;

  let xhr=new XMLHttpRequest();
  xhr.open("GET",url,true);
  xhr.onreadystatechange=function(){
    if(xhr.readyState==4&&xhr.status==200){
      document.getElementById("calendarBox").innerHTML=xhr.responseText;
      highlightNotes();
    }
  }
  xhr.send();
}

/* NOTES */
var notes = JSON.parse(localStorage.getItem("notes")) || {};
var selectedDate = "", selectedCell = null;

function openNote(date, cell){
  selectedDate = date;
  selectedCell = cell;
  document.getElementById("noteBox").style.display = "block";
  renderNoteList();
}

function closeNote(){
  document.getElementById("noteBox").style.display = "none";
}

function addNote(){
  let title = document.getElementById("noteTitle").value;
  let time = document.getElementById("noteTime").value;
  let ampm = document.getElementById("ampm").value;

  if(!notes[selectedDate]) notes[selectedDate] = [];

  notes[selectedDate].push({title,time,ampm});

  localStorage.setItem("notes", JSON.stringify(notes));

  scheduleNotification(selectedDate,time,ampm,title);

  renderNoteList();
  highlightNotes();
}

function renderNoteList(){
  let list = document.getElementById("noteList");
  list.innerHTML = "";

  if(notes[selectedDate]){
    notes[selectedDate].forEach((n, index) => {
      let li = document.createElement("li");
      li.textContent = n.title + " " + n.time + " " + n.ampm;

      // Сонгох товч
      let delBtn = document.createElement("button");
      delBtn.textContent = "Устгах";
      delBtn.style.marginLeft = "10px";
      delBtn.onclick = function(){ deleteSingleNote(index); };

      li.appendChild(delBtn);
      list.appendChild(li);
    });
  }
}

/* Нэг тэмдэглэлийг устгах функц */
function deleteSingleNote(index){
  if(notes[selectedDate] && notes[selectedDate][index]){
    notes[selectedDate].splice(index, 1); // нэг элементийг устгах
    if(notes[selectedDate].length === 0) delete notes[selectedDate]; // Хоосон бол бүхэлд нь устгах
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNoteList();
    highlightNotes();
  }
}

/* HIGHLIGHT */
function highlightNotes(){
  document.querySelectorAll("#calendarBox td").forEach(cell=>{
    let d = cell.innerText;
    let date = new Date();
    let full = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+d;
    cell.classList.remove("noteDay");
    if(notes[full]) cell.classList.add("noteDay");
  });
}

/* NOTIFICATION */
function scheduleNotification(date,time,ampm,title){
  if(!time) return;

  let [h,m] = time.split(":");
  h = parseInt(h);

  if(ampm==="PM" && h<12) h+=12;
  if(ampm==="AM" && h==12) h=0;

  let t = new Date(date);
  t.setHours(h,m,0);

  let diff = t - new Date();

  if(diff>0){
    setTimeout(()=>{
      alert("📚 "+title+" хийх цаг боллоо!");
    },diff);
  }
}