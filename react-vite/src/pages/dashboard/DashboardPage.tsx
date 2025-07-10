import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">My App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Halo, {user?.fullName}
              </span>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Informasi Pengguna</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nama Lengkap</dt>
                    <dd className="text-sm text-gray-900">{user?.fullName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{user?.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status Verifikasi</dt>
                    <dd className="text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user?.verified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {user?.verified ? 'Terverifikasi' : 'Belum Terverifikasi'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">2FA</dt>
                    <dd className="text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user?.isTwoFAEnabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        {user?.isTwoFAEnabled ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </Card>

              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Statistik</h3>
                <p className="text-sm text-gray-600">
                  Bergabung pada {new Date(user?.createdAt || '').toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </Card>

              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aksi Cepat</h3>
                <div className="space-y-2">
                  <Button variant="secondary" size="sm">
                    Edit Profile
                  </Button>
                  <Button variant="secondary" size="sm">
                    Pengaturan
                  </Button>
                </div>
              </Card>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;