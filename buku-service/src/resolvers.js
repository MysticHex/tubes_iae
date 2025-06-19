const pool = require('../database/pool');

module.exports = {
Query: {
    getAllBuku: async () => {
        const [rows] = await pool.query('SELECT * FROM buku');
        return rows;
    },

    getBukuById: async (_, { id }) => {
        const [rows] = await pool.query('SELECT * FROM buku WHERE id = ?', [id]);
        return rows[0];
    },

    getBukuByJudul: async (_, { judul }) => {
      const [rows] = await pool.query('SELECT * FROM buku WHERE judul LIKE ?', [`%${judul}%`]);
    return rows;
    },

    getBukuTersedia: async () => {
      const [rows] = await pool.query('SELECT * FROM buku WHERE jumlah > 0');
        return rows;
    },
},

Mutation: {
    addBuku: async (_, args) => {
        const [result] = await pool.query(
        `INSERT INTO buku (isbn, judul, pengarang, penerbit, tahun_terbit, jumlah) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [args.isbn, args.judul, args.pengarang, args.penerbit, args.tahun_terbit, args.jumlah]
);

      const [newBuku] = await pool.query('SELECT * FROM buku WHERE id = ?', [result.insertId]);
        return newBuku[0];
    },

    updateStokBuku: async (_, { id, jumlah }) => {
        await pool.query('UPDATE buku SET jumlah = ? WHERE id = ?', [jumlah, id]);

        const [updatedBuku] = await pool.query('SELECT * FROM buku WHERE id = ?', [id]);
        return updatedBuku[0];
    },

    deleteBuku: async (_, { id }) => {
        const [result] = await pool.query('DELETE FROM buku WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },
    },
};