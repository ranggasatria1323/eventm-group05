import { AuthPage } from './../../components/auth-page'
import { HeaderOnlyLogo } from './../../components/HeaderOnlyLogo'

export default function LoginPage() {
  return (<>
  <HeaderOnlyLogo />
  <AuthPage initialView="login" />
  </>)
}

