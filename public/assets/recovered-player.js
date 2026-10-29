(function () {
  function mountPlayer(container) {
    var source = container.dataset.hls;
    var video = document.createElement("video");

    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.poster = container.dataset.poster || "";
    video.style.cssText = "display:block;width:100%;height:100%;object-fit:contain;background:#000;";
    container.appendChild(video);

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      container.innerHTML = '<p style="color:#fff;padding:2rem;text-align:center">Your browser cannot play this video.</p>';
    }
  }

  document.querySelectorAll(".recovered-vsl").forEach(mountPlayer);
})();
