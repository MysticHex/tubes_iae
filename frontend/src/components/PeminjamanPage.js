import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_PEMINJAMAN } from '../graphql/peminjamanQueries';
import { CREATE_PEMINJAMAN, UPDATE_PEMINJAMAN_STATUS } from '../graphql/peminjamanMutations';
import { peminjamanClient, bukuClient } from '../apolloClients';
import { GET_ALL_BOOKS } from '../graphql/bukuQueries';
import { useAuth } from './AuthContext';

const PeminjamanPage = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  
  const [formData, setFormData] = useState({
    mahasiswa_id: '',
    buku_id: '',
  });

  const [statusFormData, setStatusFormData] = useState({
    id: '',
    status: ''
  });

  // Queries
  const { loading: peminjamanLoading, error: peminjamanError, data: peminjamanData, refetch } = 
    useQuery(GET_ALL_PEMINJAMAN, { 
      client: peminjamanClient,
      fetchPolicy: 'network-only'
    });

  const { loading: bukuLoading, error: bukuError, data: bukuData } = 
    useQuery(GET_ALL_BOOKS, { 
      client: bukuClient 
    });

  // Mutations
  const [createPeminjaman, { loading: creatingPeminjaman }] = useMutation(CREATE_PEMINJAMAN, {
    client: peminjamanClient,
    onCompleted: () => {
      refetch();
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating peminjaman:', error);
      alert(`Error: ${error.message}`);
    }
  });

  const [updateStatus, { loading: updatingStatus }] = useMutation(UPDATE_PEMINJAMAN_STATUS, {
    client: peminjamanClient,
    onCompleted: () => {
      refetch();
      setStatusFormData({ id: '', status: '' });
    },
    onError: (error) => {
      console.error('Error updating status:', error);
      alert(`Error: ${error.message}`);
    }
  });

  // Auto-fill mahasiswa_id from logged in user if available
  useEffect(() => {
    if (user && user.id) {
      setFormData(prev => ({
        ...prev,
        mahasiswa_id: user.id.toString()
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    setStatusFormData({
      ...statusFormData,
      [name]: value
    });
  };

  // Perbarui handleSubmit untuk menambahkan parameter yang diperlukan
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.mahasiswa_id || !formData.buku_id) {
      alert('Semua field harus diisi');
      return;
    }
    
    // Tambahkan tanggal_pinjam dan status yang diperlukan schema
    const currentDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    try {
      await createPeminjaman({
        variables: {
          mahasiswa_id: formData.mahasiswa_id,
          buku_id: formData.buku_id,
          tanggal_pinjam: currentDate,
          status: "DIPINJAM" // Default status untuk peminjaman baru
        }
      });
    } catch (err) {
      console.error('Error creating peminjaman:', err);
    }
  };

  // Gunakan enum yang sesuai dengan database
  const ALLOWED_STATUS = {
    DIPINJAM: "Dipinjam",
    DIKEMBALIKAN: "Dikembalikan",
    TERLAMBAT: "Terlambat"
  };

  // Update handleStatusSubmit untuk memastikan status valid
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    
    if (!statusFormData.id || !statusFormData.status) {
      alert('ID dan status harus diisi');
      return;
    }
    
    // Validasi status sesuai dengan yang diizinkan di database
    if (!Object.values(ALLOWED_STATUS).includes(statusFormData.status)) {
      alert(`Status tidak valid. Gunakan salah satu: ${Object.values(ALLOWED_STATUS).join(', ')}`);
      return;
    }
    
    try {
      const variables = {
        id: statusFormData.id,
        status: statusFormData.status
      };
      
      // Tambahkan tanggal_kembali jika status DIKEMBALIKAN
      if (statusFormData.status === ALLOWED_STATUS.DIKEMBALIKAN) {
        const today = new Date().toISOString().split('T')[0];
        variables.tanggal_kembali = today;
      }
      
      console.log('Mengirim update dengan variabel:', variables);
      
      await updateStatus({
        variables
      });
    } catch (err) {
      console.error('Error updating status:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const resetForm = () => {
    // Preserve mahasiswa_id if user is logged in
    setFormData({
      mahasiswa_id: user?.id?.toString() || '',
      buku_id: ''
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'DIPINJAM':
        return 'bg-warning';
      case 'DIKEMBALIKAN':
        return 'bg-success';
      case 'TERLAMBAT':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const getBukuJudul = (bukuId) => {
    if (!bukuData || !bukuData.getAllBuku) return 'Loading...';
    const buku = bukuData.getAllBuku.find(b => b.id === bukuId);
    return buku ? buku.judul : 'Buku tidak ditemukan';
  };

  if (peminjamanLoading || bukuLoading) return <p>Loading...</p>;
  if (peminjamanError) return <p>Error: {peminjamanError.message}</p>;
  if (bukuError) return <p>Error: {bukuError.message}</p>;

  return (
    <div className="container mt-4">
      <h2>Manajemen Peminjaman</h2>
      
      {/* Everyone can create new peminjaman */}
      {isAuthenticated && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            Tambah Peminjaman Baru
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">ID Mahasiswa</label>
                  <input
                    type="text"
                    name="mahasiswa_id"
                    className="form-control"
                    value={formData.mahasiswa_id}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Buku</label>
                  <select
                    name="buku_id"
                    className="form-select"
                    value={formData.buku_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih Buku</option>
                    {bukuData && bukuData.getAllBuku && bukuData.getAllBuku
                      .filter(buku => buku.jumlah > 0) // Only show books with stock > 0
                      .map(buku => (
                        <option key={buku.id} value={buku.id}>
                          {buku.judul} - {buku.pengarang} (Stok: {buku.jumlah})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={creatingPeminjaman}
                >
                  {creatingPeminjaman ? 'Menyimpan...' : 'Simpan Peminjaman'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Only admin can update status */}
      {isAdmin && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            Update Status Peminjaman
          </div>
          <div className="card-body">
            <form onSubmit={handleStatusSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">ID Peminjaman</label>
                  <select
                    name="id"
                    className="form-select"
                    value={statusFormData.id}
                    onChange={handleStatusChange}
                    required
                  >
                    <option value="">Pilih ID Peminjaman</option>
                    {peminjamanData && peminjamanData.getAllPeminjaman && 
                      peminjamanData.getAllPeminjaman.map(peminjaman => (
                        <option key={peminjaman.id} value={peminjaman.id}>
                          ID: {peminjaman.id} - {getBukuJudul(peminjaman.buku_id)} - Status: {peminjaman.status}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={statusFormData.status}
                    onChange={handleStatusChange}
                    required
                  >
                    <option value="">Pilih Status</option>
                    <option value={ALLOWED_STATUS.DIPINJAM}>{ALLOWED_STATUS.DIPINJAM}</option>
                    <option value={ALLOWED_STATUS.DIKEMBALIKAN}>{ALLOWED_STATUS.DIKEMBALIKAN}</option>
                    <option value={ALLOWED_STATUS.TERLAMBAT}>{ALLOWED_STATUS.TERLAMBAT}</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={updatingStatus}
                >
                  {updatingStatus ? 'Menyimpan...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Everyone can see the list */}
      <div className="card">
        <div className="card-header bg-primary text-white">
          Daftar Peminjaman
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mahasiswa ID</th>
                  <th>Buku</th>
                  <th>Tanggal Pinjam</th>
                  <th>Tanggal Kembali</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {peminjamanData?.getAllPeminjaman?.map(peminjaman => (
                  <tr key={peminjaman.id}>
                    <td>{peminjaman.id}</td>
                    <td>{peminjaman.mahasiswa_id}</td>
                    <td>{getBukuJudul(peminjaman.buku_id)}</td>
                    <td>{new Date(peminjaman.tanggal_pinjam).toLocaleDateString()}</td>
                    <td>
                      {peminjaman.tanggal_kembali ? 
                        new Date(peminjaman.tanggal_kembali).toLocaleDateString() : 
                        '—'
                      }
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(peminjaman.status)} text-white`}>
                        {peminjaman.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!peminjamanData?.getAllPeminjaman || peminjamanData.getAllPeminjaman.length === 0) && (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Tidak ada data peminjaman
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeminjamanPage;