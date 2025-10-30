"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { verifyMagicLoginMutationFn } from "@/lib/api";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function MagicLoginVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const { mutate } = useMutation({
    mutationFn: verifyMagicLoginMutationFn,
    onSuccess: (data) => {
      toast({
        title: "Login Berhasil",
        description: data.message || "Selamat datang kembali!",
      });
      router.replace("/home");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Link login tidak valid atau kadaluarsa.";

      router.replace(`/?error=${encodeURIComponent(message)}`);
    },
  });

  useEffect(() => {
    if (code) mutate({ code });
  }, [code]);

  return (
    <main className="h-full flex flex-col items-center justify-center text-center">
      <Loader className="animate-spin mb-4" size={28} />
      <p>Sedang memverifikasi tautan login Anda...</p>
    </main>
  );
}
