import { signIn, signOut, useSession }  from 'next-auth/client'
import styles from './styles.module.scss'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import Image from 'next/image'

export default function SigninButton() {
    const [session] = useSession()

    return session ? (
            <button
                type='button'
                className={styles.signinButton}
                onClick={() => signOut()}
                title='Sair'
            >
                <Image width={35} height={35} src={String(session.user?.image)} alt={`imagem de perfil do usuário ${session.user?.name}`} />
                Olá, {session.user?.name}
                <FiX color='#737380' className={styles.closeIcon} />
            </button>
        ): (
            <button
                type='button'
                className={styles.signinButton}
                onClick={() => signIn('github')}
            >
            <FaGithub color='#FF8800'/>
            Entrar com github
        </button>
    )
}