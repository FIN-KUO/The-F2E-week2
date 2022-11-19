pdfjsLib.GlobalWorkerOptions.workerSrc = "https://mozilla.github.io/pdf.js/build/pdf.worker.js";
const Base64Prefix = "data:application/pdf;base64,";
const file = localStorage.getItem("file");
var wrapWidth = parseInt($(".wrap").css("width"));

var animation = bodymovin.loadAnimation({
  container: document.getElementById('lottie'), // Required
  path: './image/GNsign_loading.json', // Required
  renderer: 'svg', // Required
  loop: true, // Optional
  autoplay: true, // Optional
  name: "loading", // Name for future reference. Optional.
});

async function printPDF(pdfData) {

  // 載入 PDF 檔及第一頁
  const pdfDoc = await pdfjsLib.getDocument(pdfData).promise;
  const pdfPage = await pdfDoc.getPage(1);


  // 設定尺寸及產生 canvas
  const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
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

var container = {
  data(){
    return{
      signDisplay:0,
      signData:[],
      txtDisplay:0,
      signState:0,
      hasSign:0,
      noSignDisplay:0,
    }
  },
  methods:{
    getSign(){
      const storageNum = localStorage.length;
      for(var i=1; i < storageNum ; i++){
        this.signData.push(localStorage.getItem("img" + i));
      }; 
    },
    removeSign(index){
      this.signData.splice(index, 1);
    },
    addSign(){
      window.location.href="signPage.html";
    },
    inputSign(sign){
      fabric.Image.fromURL(sign, function (image) {

        // 設定簽名出現的位置及大小，後續可調整
        image.top = 400;
        image.scaleX = 0.5;
        image.scaleY = 0.5;
        canvas.add(image);        
      });
      this.signDisplay = 0;
      this.hasSign = 1;
    },
    txtCancel(){
      $("#inputTxt").val("");
      this.txtDisplay = 0;
    },
    txtInput(){
      const txt = $("#inputTxt").val();
      const text = new fabric.Text(txt, {
        left: 0,
        top: 80
      })
      canvas.add(text);
      this.txtDisplay = 0;
    },
    complete(){
      if(this.hasSign == 1){
        this.signState = 1;
      }
      else{
        this.noSignDisplay = 1;
      };
    },
    goHome(){
      window.location.href = "index.html";
    },
    noSignClose(){
      this.noSignDisplay = 0;
    },
    download(){
      // 引入套件所提供的物件
      const pdf = new jsPDF();
      // 將 canvas 存為圖片
      const image = canvas.toDataURL("image/png");
  
      // 設定背景在 PDF 中的位置及大小
      const width = pdf.internal.pageSize.width;
      const height = pdf.internal.pageSize.height;
      pdf.addImage(image, "png", 0, 0, width, height);

      // 將檔案取名並下載
      pdf.save("download.pdf");

      const storage = localStorage;
      var result = $.map(storage, function(item, index) {
        return item.key;
      }).filter((value) => value.match(/^download/g));
      const storageNum = result.length + 1;
      localStorage.setItem('download' + storageNum, image);

      window.location.href="susses.html";
    },
  },
};

var vm = Vue.createApp(container).mount('#container');

// 此處 canvas 套用 fabric.js
const canvas = new fabric.Canvas("canvas");

window.onload = async (e) => {

  $("#begin").fadeOut(2000, function() {
    $(".content").fadeIn(1000);        
  });
  canvas.requestRenderAll();
  const pdfData = await printPDF(file);
  const pdfImage = await pdfToImage(pdfData);

  // 透過比例設定 canvas 尺寸
  canvas.setWidth(pdfImage.width / window.devicePixelRatio);
  canvas.setHeight(pdfImage.height / window.devicePixelRatio);

  // 將 PDF 畫面設定為背景
  canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
  
  
  vm.getSign();
};

$("#signLoad").on('click', function() {
  vm.signDisplay = 1;
});
$(".addSign").on('click', function() {
  vm.signDisplay = 1;
});
$("#hookLoad").on('click', function() {
  fabric.Image.fromURL("./image/Fill_black.png", function (image) {

    // 設定簽名出現的位置及大小，後續可調整
    image.top = 400;
    image.scaleX = 1;
    image.scaleY = 1;
    canvas.add(image);        
  });
});
$("#dateLoad").on('click', function() {
  const date = new Date();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var currentDate = year + "/" + month + "/" + day;
  const text = new fabric.Text(currentDate, {
    left: 0,
    top: 80
  })
  canvas.add(text);
});
$("#txtLoad").on('click', function() {
  vm.txtDisplay = 1;
});
