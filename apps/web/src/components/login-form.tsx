"use client"

import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik"
import * as Yup from "yup"
import { Button } from "./../components/ui/button"
import { Input } from "./../components/ui/input"
import { Checkbox } from "./../components/ui/checkbox"
import { Facebook, Linkedin } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { loginUser } from "../api/auth"
import Link from "next/link"

interface LoginFormValues {
  email: string
  password: string
  remember: boolean
}

export function LoginForm() {
  const router = useRouter()

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
    remember: false,
  }

  const validationSchema = Yup.object({
    email: Yup.string().email("Alamat email tidak valid").required("Wajib diisi"),
    password: Yup.string().required("Wajib diisi"),
  })

  const handleSubmit = async (
    values: LoginFormValues, 
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    const { email, password } = values;

    const result = await loginUser(email, password); // Panggil middleware login

    if (result.success) {
      router.push("/"); // Redirect setelah login berhasil
    }

    setSubmitting(false);
  }

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className="flex flex-col mt-6 items-center justify-center h-full px-4 sm:px-12 bg-white w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">Login</h1>
          <div className="mb-4">
            <Field name="email" type="email" placeholder="Email" as={Input} className="w-full sm:w-80" />
            <div className="h-5 mt-1">
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
          </div>
          <div className="mb-4">
            <Field name="password" type="password" placeholder="Password" as={Input} className="w-full sm:w-80" />
            <div className="h-5 mt-1">
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-4 gap-2">
            <div className="flex items-center">
              <Field name="remember" type="checkbox" as={Checkbox} className="mr-2" />
              <label htmlFor="remember" className="text-sm">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-gray-600 hover:text-[#4bb6b7]">
              Forgot Password
            </a>
          </div>
          <Button type="submit" className="w-full sm:w-80 mb-4 bg-[#4bb6b7] hover:bg-[#45a3a4]" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
          <a href='/register' className="sm:hidden flex justify-center w-full sm:w-80 mb-4 bg-[#b2f5f7] hover:bg-[#45a3a4]">
          <Button type="button" className="w-full">Register</Button>
          </a>
          <span className="text-sm mb-4">or use your account</span>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="border rounded-full p-2 hover:border-[#4bb6b7] transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="border rounded-full p-2 hover:border-[#4bb6b7] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="border rounded-full p-2 hover:border-[#4bb6b7] transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
          <ToastContainer />
        </Form>
      )}
    </Formik>
  )
}
