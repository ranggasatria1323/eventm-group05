'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Linkedin } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
});

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (values: FormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}register`, values);
      const data = res.data;

      if (data.status === 'success') {
        // Simpan token ke cookie
        Cookies.set('token', data.data.token, { expires: 1 }); // Expire setelah 1 hari

        // Redirect ke halaman interest untuk memilih role
        router.push('/interest');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('There was an error!', error);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ name: '', email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col items-center justify-center h-full px-12 bg-white w-80">
          <h1 className="text-3xl font-bold mb-4">Register</h1>
          <div className="h-5 mb-4 w-full">
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div className="mb-4 w-full">
            <Field
              type="text"
              name="name"
              placeholder="Name"
              as={Input}
              className="w-full"
            />
            <div className="h-5 mt-1">
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>
          </div>
          <div className="mb-4 w-full">
            <Field
              type="email"
              name="email"
              placeholder="Email"
              as={Input}
              className="w-full"
            />
            <div className="h-5 mt-1">
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
          </div>
          <div className="mb-4 w-full">
            <Field
              type="password"
              name="password"
              placeholder="Password"
              as={Input}
              className="w-full"
            />
            <div className="h-5 mt-1">
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>
          </div>
          <Button type="submit" className="w-full mb-4 bg-[#4bb6b7] hover:bg-[#45a3a4]" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
          <span className="text-sm mb-4">or use your account</span>
          <div className="flex space-x-4">
            <a href="#" className="border rounded-full p-2 hover:border-[#4bb6b7] transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="border rounded-full p-2 hover:border-[#4bb6b7] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" fillRule="evenodd" clipRule="evenodd"/></svg>
            </a>
            <a href="#" className="border rounded-full p-2 hover:border-[#4bb6b7] transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </Form>
      )}
    </Formik>
  );
}
