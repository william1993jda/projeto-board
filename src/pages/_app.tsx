import { Provider as NextAuthProvider } from 'next-auth/client'
import type { AppProps } from 'next/app'
import { Header } from '@/components/Header'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import '../styles/global.scss'

export default function App({ Component, pageProps }: AppProps) {

  const initialOptions = {
    "client-id": "AfwebDYlfxrdVtLtDr6tVehJVY_CY7qadVqDiNd3_iPgDQjmdHBtiyQn6MA3Z7wTrxxeDVMVnPNjq-Aa",
    currency: "BRL",
    intent: "capture",
  }

  return (
      <NextAuthProvider session={pageProps.session}>
        <PayPalScriptProvider options={initialOptions}>
          <Header />
          <Component {...pageProps} />
        </PayPalScriptProvider>
      </NextAuthProvider>
  )
}
