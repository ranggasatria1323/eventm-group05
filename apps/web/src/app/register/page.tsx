import { AuthPage } from '@/components/auth-page'
import { HeaderOnlyLogo } from '@/components/HeaderOnlyLogo'

export default function RegisterPage() {
  return (<><HeaderOnlyLogo />
  <AuthPage initialView="register" />
  </>)
}

