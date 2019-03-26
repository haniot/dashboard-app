const express = require('express')

const app = express()


app.use(express.static(__dirname + '/dist'))

app.get('/*', function(req,res){
    res.sendFile(__dirname + '/dist/index.html')
});

const port = process.env.DASHBOARD_PORT || 4200
app.listen(port, function(){
    console.log('App runing in PORT ' + port)
})