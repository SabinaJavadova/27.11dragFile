const tbody = document.querySelector("tbody")
const fileInput = document.querySelector("#file")
const remove = document.querySelector(".remove")
let arr = []
function drawTable(arr) {
  tbody.innerHTML="";
  arr.forEach(item => {
    const tr = document.createElement("tr")
    tr.innerHTML=`
    <td><img src="${item.Image}" alt=""></td>
    <td>${item.name}</td>
    <td>${item.size}</td>
    <i class="fa-solid fa-ban"></i>
    `
    tbody.append(tr);
  });
}

fileInput.addEventListener("change",function (event) {
  const file = event.target.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload=function(e){
      const fileData ={
        Image:e.target.result,
        name: file.name,
        size:(file.size/1024).toFixed(2),
      };
      arr.push(fileData);
      drawTable(arr)
    };
    reader.readAsDataURL(file)
  }
})

remove.addEventListener("click",function () {
  arr=[];
  drawTable(arr)
})