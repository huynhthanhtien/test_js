```
fetch('https://huynhthanhtien.github.io/test_js/js.js?version=' + Date.now())
  .then(response => response.text())
  .then(script => { eval(script);})
  .catch(error => console.error('Error loading the script:', error));
```
