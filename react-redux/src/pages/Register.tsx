import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { registerUser, clearError } from "@/reducers/authSlice";
import { registerSchema } from "@/schemas/auth.schema";
import type { RegisterFormData } from "@/schemas/auth.schema";
import AuthForm from "@/components/auth/AuthForm";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<RegisterFormData>>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof RegisterFormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      const validatedData = registerSchema.parse(formData);
      setFieldErrors({});

      // Dispatch register action
      await dispatch(registerUser(validatedData)).unwrap();
    } catch (error: any) {
      if (error.errors) {
        // Handle zod validation errors
        const errors: Partial<RegisterFormData> = {};
        error.errors.forEach((err: any) => {
          errors[err.path[0] as keyof RegisterFormData] = err.message;
        });
        setFieldErrors(errors);
      }
    }
  };

  return (
    <AuthForm title="Buat Akun Baru" onSubmit={handleSubmit}>
      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Input
        label="Nama Lengkap"
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        error={fieldErrors.fullName}
        placeholder="Masukkan nama lengkap Anda"
        required
      />

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

      <Input
        label="Konfirmasi Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={fieldErrors.confirmPassword}
        placeholder="Konfirmasi password Anda"
        required
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        {isLoading ? "Mendaftar..." : "Daftar"}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Masuk sekarang
          </Link>
        </p>
      </div>
    </AuthForm>
  );
};

export default Register;
