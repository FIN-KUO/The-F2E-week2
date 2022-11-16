pdfjsLib.GlobalWorkerOptions.workerSrc = "https://mozilla.github.io/pdf.js/build/pdf.worker.js";
const Base64Prefix = "data:application/pdf;base64,";
const data = localStorage.getItem("file");
var wrapWidth = parseInt($(".wrap").css("width"));

async function printPDF(pdfData) {

  // 載入 PDF 檔及第一頁
  const pdfDoc = await pdfjsLib.getDocument(pdfData).promise;
  const pdfPage = await pdfDoc.getPage(1);


  // 設定尺寸及產生 canvas
  const viewport = pdfPage.getViewport({ scale: 1 });
  if(wrapWidth < 425){
    viewport = pdfPage.getViewport({ scale: 0.5 });
  };  
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // 設定 PDF 所要顯示的寬高及渲染
  canvas.height = parseInt($(".canvasArea .canvas").css("height"));
  canvas.width = parseInt($(".canvasArea .canvas").css("width"));
  const renderContext = {
    canvasContext: context,
    viewport,
  };
  const renderTask = pdfPage.render(renderContext);

  // 回傳做好的 PDF canvas
  return renderTask.promise.then(() => canvas);
}

async function pdfToImage(pdfData) {

  // 設定 PDF 轉為圖片時的比例
  const scale = 1 / window.devicePixelRatio;

  // 回傳圖片
  return new fabric.Image(pdfData, {
    id: "renderPDF",
    scaleX: scale,
    scaleY: scale,
  });
}

// 此處 canvas 套用 fabric.js
const canvas = new fabric.Canvas("canvas");

window.onload = async (e) => {

  $(".overlay").fadeOut(2000, function() {
    $(".content").fadeIn(1000);        
});
  canvas.requestRenderAll();
  const pdfData = await printPDF(data);
  const pdfImage = await pdfToImage(pdfData);

  // 透過比例設定 canvas 尺寸
  canvas.setWidth(pdfImage.width / window.devicePixelRatio);
  canvas.setHeight(pdfImage.height / window.devicePixelRatio);

  // 將 PDF 畫面設定為背景
  canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
  
};
