'us client'

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
        <Form className="flex flex-col items-center justify-center h-full px-12 bg-white">
          <h1 className="text-3xl font-bold mb-4">Register</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Field
            type="text"
            name="name"
            placeholder="Name"
            className="mb-4"
            as={Input}
          />
          <ErrorMessage name="name" component="div" className="text-red-500 mb-4" />
          <Field
            type="email"
            name="email"
            placeholder="Email"
            className="mb-4"
            as={Input}
          />
          <ErrorMessage name="email" component="div" className="text-red-500 mb-4" />
          <Field
            type="password"
            name="password"
            placeholder="Password"
            className="mb-4"
            as={Input}
          />
          <ErrorMessage name="password" component="div" className="text-red-500 mb-4" />
          <Button type="submit" className="w-full mb-4 bg-[#4bb6b7] hover:bg-[#45a3a4]" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
          <span className="text-sm mb-4">or use your account</span>
          <div className="flex space-x-4">
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
  );
}
