const tbody = document.querySelector("tbody");
const fileInput = document.querySelector("#file");
const removeAll = document.querySelector(".remove");
const dropArea = document.querySelector("#dropArea");

let arr = JSON.parse(localStorage.getItem("files")) || [];

/* SAVE */
function saveToLocal() {
  localStorage.setItem("files", JSON.stringify(arr));
}

/* DRAW TABLE */
let currentAudio = null;

function drawTable() {
  tbody.innerHTML = "";

  arr.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.classList.add("fade-in");

    let preview = "";
    let action = "";

    if (item.type === "image") {
      preview = `<img src="${item.data}">`;
    } else if (item.type === "pdf") {
      preview = `<i class="fa-solid fa-file-pdf pdf"></i>`;
    } else {
      preview = `<i class="fa-solid fa-music audio"></i>`;
      action = `<i class="fa-solid fa-play play-btn"></i>`;
    }

    tr.innerHTML = `
      <td>${preview}</td>
      <td>${item.name}</td>
      <td>${item.size} KB</td>
      <td>
        ${action}
        <i class="fa-solid fa-ban delete"></i>
      </td>
    `;

    /* DELETE */
    tr.querySelector(".delete").onclick = () => {
      tr.classList.add("fade-out");
      setTimeout(() => {
        if (currentAudio) currentAudio.pause();
        arr.splice(index, 1);
        saveToLocal();
        drawTable();
      }, 300);
    };

    /* PLAY AUDIO */
    const playBtn = tr.querySelector(".play-btn");
    if (playBtn) {
      const audio = new Audio(item.audioURL);

      playBtn.onclick = () => {
        if (currentAudio && currentAudio !== audio) {
          currentAudio.pause();
          document
            .querySelectorAll(".play-btn")
            .forEach((b) => b.classList.replace("fa-pause", "fa-play"));
        }

        if (audio.paused) {
          audio.play();
          playBtn.classList.replace("fa-play", "fa-pause");
          currentAudio = audio;
        } else {
          audio.pause();
          playBtn.classList.replace("fa-pause", "fa-play");
        }
      };

      audio.onended = () => {
        playBtn.classList.replace("fa-pause", "fa-play");
      };
    }

    tbody.append(tr);
  });
}

/* HANDLE FILES */
function handleFiles(files) {
  [...files].forEach((file) => {
    // IMAGE
    if (file.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        arr.push({
          data: e.target.result,
          name: file.name,
          size: (file.size / 1024).toFixed(2),
          type: "image",
        });
        saveToLocal();
        drawTable();
      };
      reader.readAsDataURL(file);
    }

    // PDF
    else if (file.type === "application/pdf") {
      arr.push({
        name: file.name,
        size: (file.size / 1024).toFixed(2),
        type: "pdf",
      });
      saveToLocal();
      drawTable();
    }

    // AUDIO
    else if (file.type.startsWith("audio")) {
      const audioURL = URL.createObjectURL(file);

      arr.push({
        name: file.name,
        size: (file.size / 1024).toFixed(2),
        type: "audio",
        audioURL,
      });
      drawTable(); // audio local-a yazılmır
    }
  });
}

/* INPUT */
fileInput.addEventListener("change", (e) => handleFiles(e.target.files));

/* DRAG DROP */
["dragover", "dragleave", "drop"].forEach((evt) =>
  dropArea.addEventListener(evt, (e) => e.preventDefault())
);

dropArea.addEventListener("dragover", () =>
  dropArea.classList.add("drag-active")
);
dropArea.addEventListener("dragleave", () =>
  dropArea.classList.remove("drag-active")
);
dropArea.addEventListener("drop", (e) => {
  dropArea.classList.remove("drag-active");
  handleFiles(e.dataTransfer.files);
});

/* REMOVE ALL */
removeAll.addEventListener("click", () => {
  arr = [];
  saveToLocal();
  drawTable();
});

/* INIT */
drawTable();
