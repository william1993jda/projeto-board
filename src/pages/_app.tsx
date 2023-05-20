import { Provider as NextAuthProvider } from 'next-auth/client'
import type { AppProps } from 'next/app'
import { Header } from '@/components/Header'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import '../styles/global.scss'

export default function App({ Component, pageProps }: AppProps) {

  const initialOptions = {
    "client-id": "AfAuTclW3f9biQoKjT9Ac2kO5wSqA9h5rfvtGbbi4dbdKfqG7BBG6eO3X8u1RbnVnFLhsadAbXMj1fpw",
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
