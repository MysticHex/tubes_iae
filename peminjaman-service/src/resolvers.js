const pool = require('../database/pool');

module.exports = {
  Query: {
    getAllPeminjaman: async () => {
      const [rows] = await pool.query('SELECT * FROM peminjaman');
      return rows;
    },
    getPeminjamanById: async (_, { id }) => {
      const [rows] = await pool.query('SELECT * FROM peminjaman WHERE id = ?', [id]);
      return rows[0];
    },
  },
  Mutation: {
    addPeminjaman: async (_, args) => {
      const [result] = await pool.query(
        `INSERT INTO peminjaman (mahasiswa_id, buku_id, tanggal_pinjam, status) 
         VALUES (?, ?, ?, ?)`,
        [args.mahasiswa_id, args.buku_id, args.tanggal_pinjam, args.status]
      );
      const [newPeminjaman] = await pool.query('SELECT * FROM peminjaman WHERE id = ?', [result.insertId]);
      return newPeminjaman[0];
    },
    updatePeminjaman: async (_, { id, ...fields }) => {
      const updates = Object.keys(fields)
        .map((key) => `${key} = ?`)
        .join(', ');
      const values = Object.values(fields);
      await pool.query(`UPDATE peminjaman SET ${updates} WHERE id = ?`, [...values, id]);
      const [updatedPeminjaman] = await pool.query('SELECT * FROM peminjaman WHERE id = ?', [id]);
      return updatedPeminjaman[0];
    },
    deletePeminjaman: async (_, { id }) => {
      const [result] = await pool.query('DELETE FROM peminjaman WHERE id = ?', [id]);
      return result.affectedRows > 0;
    },
  },
};