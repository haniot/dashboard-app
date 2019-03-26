const express = require('express')

const app = express()


app.use(express.static(__dirname + '/dist'))

app.get('/*', function(req,res){
    res.sendFile(__dirname + '/dist/index.html')
});

const port = process.env.PORT_HTTP || 8080
app.listen(port, function(){
    console.log('Dashboard runing in PORT ' + port)
})