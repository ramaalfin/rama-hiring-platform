import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { getCurrentUser, logoutUser } from '@/reducers/authSlice';
// import { deleteSession } from '@/reducers/sessionSlice';
import Button from '@/components/ui/Button';
// import Alert from '@/components/ui/Alert';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth);
  // const { sessions, isLoading: sessionLoading, error: sessionError } = useAppSelector((state) => state.session);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated, user]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // const handleDeleteSession = async (sessionId: string) => {
  //   if (window.confirm('Apakah Anda yakin ingin menghapus sesi ini?')) {
  //     try {
  //       await dispatch(deleteSession(sessionId)).unwrap();
  //     } catch (error) {
  //       console.error('Delete session failed:', error);
  //     }
  //   }
  // };

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleString('id-ID');
  // };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Button variant="secondary" onClick={handleLogout}>
              Keluar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* User Info */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informasi Pengguna</h2>
              {user ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Nama:</span>
                    <span className="ml-2 text-sm text-gray-900">{user.fullName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <span className="ml-2 text-sm text-gray-900">{user.email}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status Verifikasi:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${user.verified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {user.verified ? 'Terverifikasi' : 'Belum Terverifikasi'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">2FA:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${user.isTwoFAEnabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {user.isTwoFAEnabled ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Memuat data pengguna...</p>
              )}
            </div>
          </div>

          {/* Sessions */}
          {/* <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Sesi Aktif</h2>

              {sessionError && (
                <Alert type="error" className="mb-4">
                  {sessionError}
                </Alert>
              )}

              {sessionLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Agent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dibuat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Berakhir
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sessions.map((session) => (
                        <tr key={session.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.userAgent || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(session.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {session.expiresAt ? formatDate(session.expiresAt) : 'Tidak berakhir'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteSession(session.id)}
                            >
                              Hapus
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {sessions.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500">Tidak ada sesi aktif</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;