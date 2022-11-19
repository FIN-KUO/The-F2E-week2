var animation = bodymovin.loadAnimation({
    container: document.getElementById('lottie'), // Required
    path: './image/ok.json', // Required
    renderer: 'svg', // Required
    loop: true, // Optional
    autoplay: true, // Optional
    name: "loading", // Name for future reference. Optional.
  });
  $("#goHome").on('click', () => {
    window.location.replace("index.html");
  });