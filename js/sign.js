pdfjsLib.GlobalWorkerOptions.workerSrc = "https://mozilla.github.io/pdf.js/build/pdf.worker.js";
const Base64Prefix = "data:application/pdf;base64,";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const clearBtn = document.querySelector(".clear");
const saveBtn = document.querySelector(".save");

// 設定線條的相關數值
ctx.lineWidth = 4;
ctx.lineCap = "round";

// 設置狀態來確認滑鼠 / 手指是否按下或在畫布範圍中
let isPainting = false;

// 取得滑鼠 / 手指在畫布上的位置
function getPaintPosition(e) {
  const canvasSize = canvas.getBoundingClientRect();

  if (e.type === "mousemove") {
    return {
      x: e.clientX - canvasSize.left,
      y: e.clientY - canvasSize.top,
    };
  } else {
    return {
      x: e.touches[0].clientX - canvasSize.left,
      y: e.touches[0].clientY - canvasSize.top,
    };
  }
}

// 開始繪圖時，將狀態開啟
function startPosition(e) {
  e.preventDefault();
  isPainting = true;
}

// 結束繪圖時，將狀態關閉，並產生新路徑
function finishedPosition() {
  isPainting = false;
  ctx.beginPath();
}

// 繪圖過程
function draw(e) {
  // 滑鼠移動過程中，若非繪圖狀態，則跳出
  if (!isPainting) return;

  // 取得滑鼠 / 手指在畫布上的 x, y 軸位置位置
  const paintPosition = getPaintPosition(e);

  // 移動滑鼠位置並產生圖案
  ctx.lineTo(paintPosition.x, paintPosition.y);
  ctx.stroke();
}

// 重新設定畫布
function reset() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveImage() {
  // 圖片儲存的類型選擇 png ，並將值放入 img 的 src
  const storage = localStorage;
  // var result = $.map(storage, function(item, index) {
  //   return item.key;
  // }).filter((value) => value.match(/^img/g));
  const storageNum = storage.length;
  
  if($("#canvas").css("display") == "block"){
    const newImg = canvas.toDataURL("image/png");
    localStorage.setItem("img" + storageNum, newImg);
  }
  else{
    const newImg = $("#signImg").prop('src');
    localStorage.setItem("img" + storageNum, newImg);
  }  
  
  window.location.href="loadingPDF.html";
}
  

// event listener 電腦板
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", finishedPosition);
canvas.addEventListener("mouseleave", finishedPosition);
canvas.addEventListener("mousemove", draw);

// event listener 手機板
canvas.addEventListener("touchstart", startPosition);
canvas.addEventListener("touchend", finishedPosition);
canvas.addEventListener("touchcancel", finishedPosition);
canvas.addEventListener("touchmove", draw);

clearBtn.addEventListener("click", reset);
saveBtn.addEventListener("click", saveImage);

var animation = bodymovin.loadAnimation({
  container: document.getElementById('lottie'), // Required
  path: './image/GNsign_loading.json', // Required
  renderer: 'svg', // Required
  loop: true, // Optional
  autoplay: true, // Optional
  name: "Hello World", // Name for future reference. Optional.
});
$( document ).ready(function() {
  $(".overlay").fadeOut(2000, function() {
    $(".content").fadeIn(1000);        
  });
  $("#signImg").css("display", "none");
});

$(".selectBtn__item").on('click', () => {
  $(".selectBtn__item").toggleClass('active');
});
$("#writeSign").on('click', () => {
  $("#canvas").css("display", "block");
  $("#signImg").css("display", "none");
});
$("#inputSign").on('click', function(e) {
  e.preventDefault();
  $('#file-input').trigger('click');
  $("#canvas").css("display", "none");
  $("#signImg").css("display", "block");
});

const selectFile = document.querySelector("#file-input");
selectFile.addEventListener("change", (e) => {
  if (e.target.files[0] === undefined) return;
  const file = e.target.files[0];
  const fileReader = new FileReader();  

  fileReader.addEventListener("load", function () {
    const pdfDataUrl  = fileReader.result;
    const showImage = document.querySelector("#signImg");
    showImage.src = pdfDataUrl;
  }, false);

  if (file) {
    fileReader.readAsDataURL(file);
  }
});



$(".black").parent("li").on('click', () => {
  $(".black").parent("li").addClass('black_active');
  $(".blue").parent("li").removeClass('blue_active');
  $(".red").parent("li").removeClass('red_active');
  ctx.strokeStyle = "black";
});
$(".blue").parent("li").on('click', () => {
  $(".black").parent("li").removeClass('black_active');
  $(".blue").parent("li").addClass('blue_active');
  $(".red").parent("li").removeClass('red_active');
  $(".canvasName").css("color","#0014C7");
  ctx.strokeStyle = "blue";
});
$(".red").parent("li").on('click', () => {
  $(".black").parent("li").removeClass('black_active');
  $(".blue").parent("li").removeClass('blue_active');
  $(".red").parent("li").addClass('red_active');
  $(".canvasName").css("color","#CA0000");
  ctx.strokeStyle = "red";
});

