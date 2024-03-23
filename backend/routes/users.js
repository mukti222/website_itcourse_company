// import express from 'express';
// import path from 'path';

const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
router.use(bodyParser.json());
const usersFilePath = path.join(__dirname, '../users.json');



//############################ REGISTER ##############################
router.post('/register', (req, res) => {
  // Baca data pengguna dari file JSON
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    // Parsing data JSON ke JavaScript object
    let users = JSON.parse(data);

    // Dapatkan data dari body request
    const { fullname, email, password, address, gender } = req.body;

    // Cek apakah email sudah terdaftar
    const existingUser = users.users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Buat objek pengguna baru
    const newUser = {
      id: users.users.length + 1,
      fullname,
      email,
      password, 
      address,
      gender
    };

    // Tambahkan pengguna baru ke array pengguna
    users.users.push(newUser);

    // Tulis kembali data ke file JSON
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), err => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      // Kirim respons sukses
      res.status(200).json({ message: 'Registrasi berhasil' });
    });
  });
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
