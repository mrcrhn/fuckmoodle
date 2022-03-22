# inject
```js
;(() => {
  const s = document.createElement("script")
  s.src = "http://127.0.0.1:8080/client.cjs"
  document.body.appendChild(s)
})()
```