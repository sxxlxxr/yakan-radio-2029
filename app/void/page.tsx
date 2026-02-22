<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>03:33</title>
<style>
html, body {
  margin: 0;
  padding: 0;
  background: black;
  color: #00ff99;
  font-family: monospace;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
#text {
  opacity: 0;
  transition: opacity 1.5s ease;
  letter-spacing: 3px;
}
.glitch {
  animation: flicker 0.15s infinite alternate;
}
@keyframes flicker {
  0% { opacity: 0.2; }
  100% { opacity: 1; }
}
</style>
</head>
<body>

<div id="text">connection lost</div>

<script>
setTimeout(() => {
  const t = document.getElementById("text");
  t.style.opacity = "1";
  t.classList.add("glitch");
}, 3000);

setTimeout(() => {
  window.close();
  window.location.href = "about:blank";
}, 6500);
</script>

</body>
</html>
