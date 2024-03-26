// import express from 'express';
// import path from 'path';

const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
router.use(bodyParser.json());


const usersFilePath = path.join(__dirname, '../users.json');

// Middleware untuk mengambil data pengguna dari berkas JSON
const getUsers = () => {
    const usersData = fs.readFileSync(usersFilePath);
    return JSON.parse(usersData);
};

// Middleware untuk menulis data pengguna ke berkas JSON
const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Route untuk registrasi pengguna
router.post('/register', (req, res) => {
    // Mendapatkan data dari formulir registrasi
    const { fullname, email, password, address, gender } = req.body;

    // Memuat data pengguna dari berkas JSON
    const users = getUsers();

    // Memeriksa apakah email sudah terdaftar
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Menambahkan pengguna baru ke dalam array pengguna
    const newUser = { fullname, email, password, address, gender };
    users.push(newUser);

    // Menyimpan data pengguna ke dalam berkas JSON
    saveUsers(users);

    // Memberikan respons sukses
    res.status(200).json({ message: 'Registrasi berhasil' });
});



//################################# Login ################################
let isLoggedIn = false;
let nameuserloged = false

router.post('/login', (req, res) => {
  // Baca data dari file users.json
  fs.readFile('users.json', 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Terjadi kesalahan saat membaca data pengguna' });
      }

      // Ubah data JSON menjadi objek JavaScript
      const users = JSON.parse(data);

      // Ambil email dan password dari permintaan
      const { email, password } = req.body;

      // Cari pengguna dengan email yang cocok
      const user = users.find(user => user.email === email);

      // Jika pengguna tidak ditemukan
      if (!user) {
          return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
      }

      // Jika password tidak cocok
      if (user.password !== password) {
          return res.status(401).json({ message: 'Kata sandi salah' });
      }

      // Jika email dan password cocok, kirim respons berhasil
      res.status(200).json({ message: 'Login berhasil' });
      isLoggedIn = true;
  });
});

router.get('/isLoggedIn', (req, res) => {
  // Kirim status isLoggedIn saat ini sebagai respons
  res.status(200).json({ nameuserloged });
});


router.post('/logout', (req, res) => {
  // Update state to indicate user is logged out
  isLoggedIn = false;
  res.send('Logout successful');
});


//######################## percobaan ambil name ##########################

router.get('/fullname', (req, res) => {
    const { email } = req.query;

    // Baca data dari file users.json
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Terjadi kesalahan saat membaca data pengguna' });
        }

        // Ubah data JSON menjadi objek JavaScript
        const users = JSON.parse(data);

        // Cari pengguna dengan email yang cocok
        const user = users.find(user => user.email === email);

        // Jika pengguna tidak ditemukan
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }

        // Jika pengguna ditemukan, kirimkan respons dengan fullname pengguna
        res.status(200).json({ fullname: user.fullname });
    });
});

module.exports = router;
