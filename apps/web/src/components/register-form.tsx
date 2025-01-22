"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Linkedin } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters long").required("Password is required"),
});

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}register`, values);
      const data = res.data;

      if (data.status === "success") {
        Cookies.set("token", data.data.token, { expires: 1 });
        toast.success("Registrasi berhasil! Silakan pilih minat Anda.");
        router.push("/interest");
      } else {
        setError("");
        toast.error(data.message);
      }
    } catch (error: any) {
      setError("");
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage = error.response.data.message;
          if (errorMessage === "Email sudah terdaftar") {
            toast.warn("Email sudah terdaftar. Silakan gunakan email lain.");
          } else {
            toast.error(errorMessage || "Terjadi kesalahan saat registrasi. Silakan coba lagi.");
          }
        } else if (error.request) {
          toast.error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
        } else {
          toast.error("Terjadi kesalahan saat memproses permintaan Anda.");
        }
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui. Silakan coba lagi nanti.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col items-center justify-center h-full px-4 sm:px-12 bg-white w-full max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-4">Register</h1>
            <div className="mb-4 w-full">
              <Field type="text" name="name" placeholder="Name" as={Input} className="w-full sm:w-80" />
              <div className="h-5 mt-1">
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>
            </div>
            <div className="mb-4 w-full">
              <Field type="email" name="email" placeholder="Email" as={Input} className="w-full sm:w-80" />
              <div className="h-5 mt-1">
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>
            </div>
            <div className="mb-4 w-full">
              <Field type="password" name="password" placeholder="Password" as={Input} className="w-full sm:w-80" />
              <div className="h-5 mt-1">
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full sm:w-80 mb-4 bg-[#4bb6b7] hover:bg-[#45a3a4]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
            <span className="text-sm mb-4">or use your account</span>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="border rounded-full p-2 hover:border-[#4bb6b7] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="border rounded-full p-2 hover:border-[#4bb6b7] transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </Form>
        )}
      </Formik>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

