import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { loginUser, clearError } from '@/reducers/authSlice';
import { loginSchema } from '@/schemas/auth.schema';
import type { LoginFormData } from '@/schemas/auth.schema';
import AuthForm from '@/components/auth/AuthForm';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<LoginFormData>>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof LoginFormData]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      const validatedData = loginSchema.parse(formData);
      setFieldErrors({});

      // Dispatch login action
      await dispatch(loginUser(validatedData)).unwrap();

    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'errors' in error &&
        Array.isArray((error as { errors: unknown }).errors)
      ) {
        // Handle zod validation errors
        const errors: Partial<LoginFormData> = {};
        (error as { errors: Array<{ path: [string]; message: string }> }).errors.forEach((err) => {
          errors[err.path[0] as keyof LoginFormData] = err.message;
        });
        setFieldErrors(errors);
      }
    }
  };

  return (
    <AuthForm title="Masuk ke Akun Anda" onSubmit={handleSubmit}>
      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={fieldErrors.email}
        placeholder="Masukkan email Anda"
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={fieldErrors.password}
        placeholder="Masukkan password Anda"
        required
      />

      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full"
      >
        {isLoading ? 'Masuk...' : 'Masuk'}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </AuthForm>
  );
};

export default Login;