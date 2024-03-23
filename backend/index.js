const express = require('express');
// import express from 'express';
const path = require('path')
// import path from 'path';
const app = express();
// Menentukan lokasi file index.html
const indexPath = path.join(__dirname, '..', 'index.html');

// Menentukan folder yang berisi file statis
//utk ambil file gmbr dll, css
app.use(express.static(path.join(__dirname, '..')));


// Route untuk halaman index.html
app.get('/', (req, res) => {
  res.sendFile(indexPath);
});


//hubungin routes ke sini
const users = require('./routes/users.js');
app.use('/users', users);


app.listen(3000, () => {
    console.log(`Server ran in 3000`);
});



