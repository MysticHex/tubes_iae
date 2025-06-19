const pool = require('../database/pool');

module.exports = {
  Query: {
    getAllMahasiswa: async () => {
      const [rows] = await pool.query('SELECT * FROM mahasiswa');
      return rows;
    },
    getMahasiswaById: async (_, { id }) => {
      const [rows] = await pool.query('SELECT * FROM mahasiswa WHERE id = ?', [id]);
      return rows[0];
    },
    getMahasiswaByNim: async (_, { nim }) => {
      const [rows] = await pool.query('SELECT * FROM mahasiswa WHERE nim = ?', [nim]);
      return rows[0];
    },
  },
  Mutation: {
    addMahasiswa: async (_, args) => {
      const [result] = await pool.query(
        `INSERT INTO mahasiswa (nim, nama, jurusan, angkatan, email) 
         VALUES (?, ?, ?, ?, ?)`,
        [args.nim, args.nama, args.jurusan, args.angkatan, args.email]
      );
      const [newMahasiswa] = await pool.query('SELECT * FROM mahasiswa WHERE id = ?', [result.insertId]);
      return newMahasiswa[0];
    },
    updateMahasiswa: async (_, { id, ...fields }) => {
      const updates = Object.keys(fields)
        .map((key) => `${key} = ?`)
        .join(', ');
      const values = Object.values(fields);
      await pool.query(`UPDATE mahasiswa SET ${updates} WHERE id = ?`, [...values, id]);
      const [updatedMahasiswa] = await pool.query('SELECT * FROM mahasiswa WHERE id = ?', [id]);
      return updatedMahasiswa[0];
    },
    deleteMahasiswa: async (_, { id }) => {
      const [result] = await pool.query('DELETE FROM mahasiswa WHERE id = ?', [id]);
      return result.affectedRows > 0;
    },
  },
};