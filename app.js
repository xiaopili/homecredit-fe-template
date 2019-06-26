let path = require('path');
let express = require('express');
let app = express();
app.use('/static', express.static(path.join(__dirname, 'dist')));
app.listen(3001);