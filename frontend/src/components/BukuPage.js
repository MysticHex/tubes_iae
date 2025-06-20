import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_BOOKS } from '../graphql/bukuQueries';
import { CREATE_BOOK, UPDATE_BOOK, DELETE_BOOK } from '../graphql/bukuMutations';
import { bukuClient } from '../apolloClients';
import { useAuth } from './AuthContext';

const BukuPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    isbn: '',
    judul: '',
    pengarang: '',
    penerbit: '',
    tahun_terbit: '',
    jumlah: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Query untuk mendapatkan semua buku
  const { loading, error, data, refetch } = useQuery(GET_ALL_BOOKS, { 
    client: bukuClient 
  });

  // Mutations untuk operasi CRUD
  const [createBook] = useMutation(CREATE_BOOK, {
    client: bukuClient,
    onCompleted: () => {
      refetch();
      resetForm();
    }
  });

  const [updateBook] = useMutation(UPDATE_BOOK, {
    client: bukuClient,
    onCompleted: () => {
      refetch();
      resetForm();
    }
  });

  const [deleteBook] = useMutation(DELETE_BOOK, {
    client: bukuClient,
    onCompleted: () => refetch()
  });

  // Handler untuk perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handler untuk submit form (TAMBAHKAN FUNGSI INI)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Konversi nilai numerik
      const numFormData = {
        ...formData,
        tahun_terbit: parseInt(formData.tahun_terbit),
        jumlah: parseInt(formData.jumlah)
      };
      
      if (editMode) {
        await updateBook({
          variables: {
            id: currentId,
            ...numFormData
          }
        });
        setEditMode(false);
      } else {
        await createBook({
          variables: numFormData
        });
      }
    } catch (err) {
      console.error('Error saving book:', err);
    }
  };

  // Handler untuk mengedit buku
  const handleEdit = (book) => {
    setFormData({
      isbn: book.isbn,
      judul: book.judul,
      pengarang: book.pengarang,
      penerbit: book.penerbit,
      tahun_terbit: book.tahun_terbit.toString(),
      jumlah: book.jumlah.toString()
    });
    setCurrentId(book.id);
    setEditMode(true);
  };

  // Handler untuk menghapus buku
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      try {
        await deleteBook({
          variables: { id }
        });
      } catch (err) {
        console.error('Error deleting book:', err);
      }
    }
  };

  // Fungsi untuk reset form
  const resetForm = () => {
    setFormData({
      isbn: '',
      judul: '',
      pengarang: '',
      penerbit: '',
      tahun_terbit: '',
      jumlah: ''
    });
    setCurrentId(null);
    setEditMode(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mt-4">
      <h2>Manajemen Buku</h2>
      
      {/* Only show form if user is admin */}
      {isAdmin && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            {editMode ? 'Edit Buku' : 'Tambah Buku Baru'}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    className="form-control"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Judul</label>
                  <input
                    type="text"
                    name="judul"
                    className="form-control"
                    value={formData.judul}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Pengarang</label>
                  <input
                    type="text"
                    name="pengarang"
                    className="form-control"
                    value={formData.pengarang}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Penerbit</label>
                  <input
                    type="text"
                    name="penerbit"
                    className="form-control"
                    value={formData.penerbit}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tahun Terbit</label>
                  <input
                    type="number"
                    name="tahun_terbit"
                    className="form-control"
                    value={formData.tahun_terbit}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Jumlah</label>
                  <input
                    type="number"
                    name="jumlah"
                    className="form-control"
                    value={formData.jumlah}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">
                  {editMode ? 'Update Buku' : 'Simpan Buku'}
                </button>
                {editMode && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="card">
        <div className="card-header bg-primary text-white">
          Daftar Buku
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ISBN</th>
                  <th>Judul</th>
                  <th>Pengarang</th>
                  <th>Penerbit</th>
                  <th>Tahun</th>
                  <th>Jumlah</th>
                  {isAdmin && <th>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {data?.getAllBuku?.map(book => (
                  <tr key={book.id}>
                    <td>{book.isbn}</td>
                    <td>{book.judul}</td>
                    <td>{book.pengarang}</td>
                    <td>{book.penerbit}</td>
                    <td>{book.tahun_terbit}</td>
                    <td>{book.jumlah}</td>
                    {isAdmin && (
                      <td>
                        <button 
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(book)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(book.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BukuPage;