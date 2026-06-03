const greeting=
document.getElementById('greeting');

function updateGreeting(){

const h=
new Date().getHours();

const n=
localStorage.getItem('username')||'Guys';

let t=
h<12?'Good Morning':h<15?'Good Afternoon':h<18?'Good Afternoon':'Good Evening';

greeting.textContent=`${t}, ${n} 👋`;

}

function saveName(){

const i=
document.getElementById('nameInput');

if(!i.value.trim())return;

localStorage.setItem('username',i.value.trim());

i.value='';updateGreeting();

}

updateGreeting();

function updateDateTime(){
    const now = new Date();

    document.getElementById("clock")
    .textContent = now.toLocaleTimeString ("id-ID");
    document.getElementById("date")
    .textContent = now. toLocaleDateString ("id-ID",
    {
        weekday:"long",
        day:"numeric",
        month:"long",
        year:"numeric"
    });

}

updateDateTime();
setInterval(updateDateTime, 1000)

const themeToggle=document.getElementById('themeToggle');

if(localStorage.getItem('theme')==='dark'){document.body.classList.add('dark');themeToggle.checked=true;

}

themeToggle.addEventListener('change',()=>{

document.body.classList.toggle('dark',themeToggle.checked);

localStorage.setItem('theme',themeToggle.checked?'dark':'light');

});

let time=1500, interval=null;

function updateTimer(){

    const m=Math

    .floor(time/60),s=time%60;document

    .getElementById('timer')

    .textContent=`${String(m)

        .padStart(2,'0')}:${String(s)

            .padStart(2,'0')}`
        }

function startTimer(){

    if(interval)return;

    interval=setInterval(()=>{if(time>0){time--;

        updateTimer()}else{clearInterval(interval);

            interval=null;

            alert('Waktu fokus selesai!')}

        }

        ,1000)
    
    }

function pauseTimer(){

    clearInterval(interval);

    interval=null
}

function resetTimer(){

    clearInterval(interval);

    interval=null;

    time=1500;

    updateTimer()

}

updateTimer();

let tasks=JSON.parse(localStorage.getItem('tasks')||'[]');

let currentFilter='all';

function saveTasks(){

    localStorage.setItem('tasks',JSON.stringify(tasks))

}
function updateProgress(){

    const c=tasks

    .filter(t=>t.completed).length;

    document.getElementById('taskProgress').textContent=`${c} / ${tasks.length} completed`

}

function setFilter(f){currentFilter=f;renderTasks()}

function renderTasks(){

const list=document.getElementById('taskList');list.innerHTML='';

let filtered=tasks;

if(currentFilter==='active')filtered=tasks.filter(t=>!t.completed);

if(currentFilter==='completed')filtered=tasks.filter(t=>t.completed);

filtered.forEach(task=>{

const idx=tasks.indexOf(task);

const li=document.createElement('li');

li.innerHTML=`<span class="${task.completed?'done':''}">${task.text} </span><div class="task-actions"><button onclick="toggleTask(${idx})">✓</button><button onclick="deleteTask(${idx})">🗑</button></div>`;
list.appendChild(li);
});

updateProgress();

}

function addTask(){

const i=document.getElementById('taskInput');

const text=i.value.trim(); if(!text)return;

tasks.unshift({text,completed:false}); saveTasks(); renderTasks(); i.value='';

}

function toggleTask(i){tasks[i].completed=!tasks[i].completed;saveTasks();renderTasks()}

function deleteTask(i){tasks.splice(i,1);saveTasks();renderTasks()}

document.getElementById('taskInput').addEventListener('keypress',e=>{if(e.key==='Enter')addTask()});

document.getElementById('nameInput').addEventListener('keypress',e=>{if(e.key==='Enter')saveName()});

renderTasks();

let links=JSON.parse(localStorage.getItem('links')||'[]');

function saveLinks(){localStorage.setItem('links',JSON.stringify(links))}

function renderLinks(){

const c=document.getElementById('linksContainer'); c.innerHTML='';

links.forEach((link,i)=>{

const d=document.createElement('div'); d.className='link-item';

d.innerHTML=`<a href="${link.url}" target="_blank">${link.name}</a><button onclick="deleteLink(${i})">🗑</button>`;

c.appendChild(d);

});

}

function addLink(){

const n=document.getElementById('linkName');

const u=document.getElementById('linkUrl');

if(!n.value.trim()||!u.value.trim()) return;

if(!u.value.startsWith('http://')&&!u.value.startsWith('https://')){alert('Input the correct url');return;}

links.push({name:n.value.trim(),url:u.value.trim()});

saveLinks(); renderLinks(); n.value=''; u.value='';

}

function deleteLink(i){links.splice(i,1); saveLinks(); renderLinks();}

renderLinks();
