
$('.file-upload').on('click', function(e) {
  e.preventDefault();
  $('#file-input').trigger('click');
});

const selectFile = document.querySelector("#file-input");
selectFile.addEventListener("change", (e) => {
  if (e.target.files[0] === undefined) return;
  const file = e.target.files[0];
  const fileReader = new FileReader();  

  fileReader.addEventListener("load", function () {
    const pdfDataUrl  = fileReader.result;
    localStorage.setItem('file' , pdfDataUrl);
  }, false);

  if (file) {
    fileReader.readAsDataURL(file);
  }
  
  window.location.replace("loadingPDF.html")
});

