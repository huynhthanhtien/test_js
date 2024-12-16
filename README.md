```
fetch('')
  .then(response => response.text())
  .then(script => {
    eval(script);
  })
  .catch(error => console.error('Error loading the script:', error));
```
