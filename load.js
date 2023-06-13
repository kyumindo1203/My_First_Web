
function load() {
    fetch("http://localhost:3002/api/contents", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(datum => {
    
        return(datum["message"])
    
      })
      .catch(err => {
        if (err) {
          console.log(err)
        }
      })
    
  }

var data = load()

export default data