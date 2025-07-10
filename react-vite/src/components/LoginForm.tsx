import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { loginSchema } from '@/utils/validation';
import type { LoginFormData } from '@/utils/validation';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useLoginMutation } from '@/redux/auth/services/authApi';
import { useAppSelector } from '@/redux/store';

const LoginForm = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Masuk</h1>
        <p className="text-gray-600 mt-2">Masuk ke akun Anda</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="email"
          placeholder="nama@email.com"
          {...register('email')}
        />

        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}

        <Input
          type="password"
          placeholder="Masukkan password"
          {...register('password')}
        />

        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password.message}</p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">
              {((error as { data?: { message?: string } })?.data?.message) || 'Login gagal. Silakan coba lagi.'}
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className='w-full bg-blue-600 text-white hover:bg-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? 'Masuk...' : 'Masuk'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Belum punya akun?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
            Daftar sekarang
          </Link>
        </p>
        <p className="text-gray-600 mt-2">
          <Link to="/forgot-password" className="text-blue-600 hover:text-blue-500 font-medium">
            Lupa password?
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default LoginForm;