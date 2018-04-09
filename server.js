var express = require('express');
var app = express();
var path = require('path');
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));

// Start the API server
app.listen(PORT, function() {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
  