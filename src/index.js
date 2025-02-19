const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
const port = process.env.PORT;

const cors = require("cors");
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/siswa", async (req, res) => {
  const siswa = await prisma.user.findMany();
  if (siswa.length == 0) {
    res.status(400).send({ message: "data notfound", data: siswa });
  } else {
    res.send({ data: siswa, message: "success" });
  }
});
// ✅ Get Siswa by ID
app.get("/siswa/:id", async (req, res) => {
  const { id } = req.params;
  const siswa = await prisma.siswa.findUnique({ where: { id } });
  if (!siswa) return res.status(404).send({ message: "Siswa tidak ditemukan" });
  res.sensd(siswa);
});

// ✅ Create Siswa
app.post("/siswa", async (req, res) => {
  const newSiswa = req.body;
  // const { nama } = req.body;
  console.log(req.body);
  try {
    const siswa = await prisma.user.create({
      data: {
        nama: newSiswa.nama,
      },
    });
    res.send(siswa);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// ✅ Update Siswa
app.put("/siswa/:id", async (req, res) => {
  const { id } = req.params;
  const { nama, kelas, umur } = req.body;
  try {
    const updatedSiswa = await prisma.user.update({
      where: { id },
      data: { nama, kelas, umur: Number(umur) },
    });
    res.send(updatedSiswa);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// ✅ Delete Siswa
app.delete("/siswa/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: "Siswa berhasil dihapus" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
