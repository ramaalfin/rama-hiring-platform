"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, Loader, Mail, MailCheckIcon } from "lucide-react";
import { registerMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function SignUp() {
  const [isSubmited, setIsSubmited] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: registerMutationFn,
  });
  const formSchema = z
    .object({
      fullName: z.string().trim().min(1, {
        message: "Name is required",
      }),
      email: z.string().trim().email().min(1, {
        message: "Email is required",
      }),
      password: z.string().trim().min(1, {
        message: "Password is required",
      }),
      confirmPassword: z.string().trim().min(1, {
        message: "Confirm password is required",
      }),
    })
    .refine((val) => val.password === val.confirmPassword, {
      message: "Password does not match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values, {
      onSuccess: () => {
        setIsSubmited(true);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <main className="w-full h-full p-8 rounded-md">
      {!isSubmited ? (
        <>
          <h1 className="text-xl tracking-[-0.16px] font-bold mb-1.5 text-center sm:text-left text-neutral-1000">
            Bergabung dengan Rakamin
          </h1>
          <p className="mb-4 text-center sm:text-left text-base font-normal text-neutral-1000">
            Sudah punya akun?{" "}
            <Link className="text-primary" href="/">
              Masuk
            </Link>
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-neutral-90">
                        Alamat Email
                      </FormLabel>
                      <FormControl>
                        <Input autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className="w-full text-[15px] h-[40px] text-neutral-90 font-semibold bg-secondary"
                disabled={isPending}
                type="submit"
              >
                {isPending && <Loader className="animate-spin" />}
                Daftar
              </Button>

              <div className="mb-6 mt-6 flex items-center justify-center">
                <div
                  aria-hidden="true"
                  className="w-full border border-neutral-60"
                  data-orientation="horizontal"
                  role="separator"
                ></div>
                <h1 className="mx-4 text-sm text-neutral-60">or</h1>
                <div
                  aria-hidden="true"
                  className="w-full border border-neutral-60"
                  data-orientation="horizontal"
                  role="separator"
                ></div>
              </div>
            </form>
          </Form>
          <Link className="flex items-center gap-2" href="/signup">
            <Button
              variant="outline"
              className="w-full h-[40px] text-neutral-1000"
            >
              <KeyRound className="!w-3 font-bold" />
              Masuk dengan kata sandi
            </Button>
          </Link>
        </>
      ) : (
        <div className="w-full h-[80vh] flex flex-col gap-2 items-center justify-center rounded-md">
          <div className="size-[48px]">
            <MailCheckIcon size="48px" className="animate-bounce" />
          </div>
          <h2 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold">
            Cek email anda
          </h2>
          <p className="mb-2 text-center text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal">
            Kami telah mengirimkan tautan verifikasi ke {form.getValues().email}
            .
          </p>
          <Link href="/">
            <Button className="h-[40px]">Kembali ke login</Button>
          </Link>
        </div>
      )}
    </main>
  );
}
