
let model = document.getElementById("model1");
let model2 = document.getElementById("model2");
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let notesSection = document.querySelector(".notes");
let inputTitle = document.getElementById("inputTitle");
let inputDescription = document.getElementById("inputDescription");
let addTitle = document.getElementById("addTitle");
let savebtn = document.getElementById("savebtn");
let yes = document.getElementById("yes");
let no = document.getElementById("no");
let count = document.getElementById('count')

document.getElementById('add').onclick = () => {
  changeModelMode(true)
  model.showModal()
}
let isUpdate = false,
  updateId;
function displayNotes() {
  document.querySelectorAll(".note").forEach((li) => li.remove());
  notes.forEach((note, id) => {
    let purifyNote = decodeURIComponent(note.des);
    let pureTitle = decodeURIComponent(note.title);
    let newNote = `<div class="note">
<div class="content">
<h3>${pureTitle}</h3>
<p>${purifyNote}</p>
</div>
<div class="footer">
<span id="date" >${note.currentDate}</span>
<div class="wr">
<i onclick="shareNote(this)" class="material-icons">share</i>
<i onclick="copyNote(this)" class="material-icons">content_copy</i>
<i onclick="deleteNote(${id})" class="material-icons">delete</i>
<i onclick="updateNote(${id},'${note.title}','${note.des}')" class="material-icons">edit</i>
</div>
</div>
</div>`;

    notesSection.insertAdjacentHTML("beforeend", newNote);
  });
  void notesSection.offsetWidth;
  document.querySelectorAll(".note").forEach((note) => {
    note.style.opacity = 1;
  });
}

displayNotes();
function previewNote(e) {
  console.log(e);
}

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()
  addNote()
  makeGetRequest("/update")
})
function addNote() {
  changeModelMode(true);

  if (!inputTitle.value || !inputDescription.value) return
  let title = encodeURIComponent(inputTitle.value);
  let des = encodeURIComponent(inputDescription.value);
  let currentDate = getCurrentFormattedDate();
  let noteInfo = { title, des, currentDate };

  if (!isUpdate) {
    notes.push(noteInfo);
  } else {
    isUpdate = false;
    notes[updateId] = noteInfo;
  }
  localStorage.setItem("notes", JSON.stringify(notes));

  displayNotes();
  CloseModel();
  resetInputes();
}

function resetInputes() {
  inputTitle.value = null;
  inputDescription.value = null;
}

function copyNote(e) {
  let p = selectElement(e, "p");
  navigator.clipboard.writeText(p.textContent);
  e.textContent = "check";
  setTimeout(() => {
    e.textContent = "content_copy";
  }, 3000);
}

function shareNote(e) {
  let title = selectElement(e, "h3").textContent;
  let desc = selectElement(e, "p").textContent;
  const shareData = {
    title: title,
    text: desc,
    url: window.location.href,
  };

  navigator
    .share(shareData)
    .then(() => {
      console.log("Shared successfully");
    })
    .catch((error) => {
      console.error("Error sharing:", error);
    });
}

function selectElement(e, elementToSelect) {
  let l = e.parentNode.parentNode.parentNode;
  return l.querySelector(elementToSelect);
}

function deleteNote(id) {
  model2.showModal();
  yes.addEventListener("click", () => {
    notes.splice(id, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    model2.close();
    displayNotes();
  });
  no.addEventListener("click", () => {
    model2.close();
  });
}

function updateNote(id, title, des) {
  changeModelMode(false);
  resetInputes();
  isUpdate = true;
  updateId = id;
  inputTitle.value = decodeURIComponent(title);
  inputDescription.value = decodeURIComponent(des);
  OpenModel();
}

function changeModelMode(isAdd) {
  if (isAdd) {
    savebtn.textContent = "Save";
    addTitle.textContent = "Add Note";
  } else {
    savebtn.textContent = "Update";
    addTitle.textContent = "Edit Note";
  }
}

function CloseModel() {
  model.close();
  resetInputes();
}
function OpenModel() {
  model.showModal();
}

function getCurrentFormattedDate() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const day = currentDate.getDate();
  const monthIndex = currentDate.getMonth();
  const formattedDate = `${day} ${months[monthIndex]}`;

  return formattedDate;
}




const searchInput = document.getElementById("search");


searchInput.addEventListener("input", function() {
  const searchQuery = searchInput.value.toLowerCase();

  const contentDivs = document.querySelectorAll('.note')

  contentDivs.forEach((contentDiv) => {
    const h3Text = contentDiv.querySelector("h3").textContent.toLowerCase();
    const pText = contentDiv.querySelector("p").textContent.toLowerCase();

    if (h3Text.includes(searchQuery) || pText.includes(searchQuery)) {
      contentDiv.style.display = "flex";
    } else {
      contentDiv.style.display = "none";
    }
  });
});



function makeGetRequest(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        console.log("err")
      }

      return response.json();
    })
    .then((data) => {
      console.log(data)
      count.innerHTML = data[0].count
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}
makeGetRequest("/get")
