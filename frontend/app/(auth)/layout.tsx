import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full min-h-screen bg-[#FAFAFA]">
      <div className="w-full max-w-[450px] mx-auto px-4">
        <Image
          src="/assets/logo/Logo Rakamin.svg"
          alt="Logo"
          width={150}
          height={50}
          className="mx-auto sm:mx-0"
        />
        <div className="bg-white">{children}</div>
      </div>
      <Toaster />
    </div>
  );
}
