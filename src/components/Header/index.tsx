import Link from 'next/link'
import { useSession }  from 'next-auth/client'
import styles from './styles.module.scss'
import SigninButton from '../SigninButton'
import Image from 'next/image'
import logo from '../../../public/images/logo.png'

export function Header() {
    const [session] = useSession()

    return (
        <header className={styles.headerContainer}>
           <div className={styles.headerContent}>
            <Link href="/">
                <Image src={logo} alt="logo meu board" />
            </Link>
            <nav>
                <Link href="/">
                    Home
                </Link>
                {session && (
                    <Link href="/board">
                        Board
                    </Link>
                )}
            </nav>
            <SigninButton />
           </div>
        </header>
    )
}