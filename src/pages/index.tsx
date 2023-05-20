import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import boardUser from '../../public/images/board-user.svg'
import styles from '../styles/styles.module.scss'
import { useState } from 'react'
import firebase from 'firebase'

type Data = {
  id: string,
  donate: boolean;
  lastDonate: Date;
  image: string;
}

interface HomePage {
  data: string;
}

export default function Home({ data }: HomePage) {
  const [donaters, setDonaters] = useState<Data[]>(JSON.parse(data))

  return (
    <>
      <Head>
        <title>Board - organizando suas tarefas.</title>
      </Head>
    
      <main className={styles.contentContainer}>
          <Image src={boardUser} alt="ferramenta board" />
          
          <section className={styles.callToAction}>
            <h1>Uma ferramenta para o seu dia a dia. Escreva, planeje e organize-se...</h1>
            <p>
              <span>100% gratuita</span> e online.
            </p>
          </section>
          {donaters.length !== 0 && <h3>Apoiadores:</h3>}
          <div className={styles.donaters}>
            {donaters.map( item => (
              <Image width={65} height={65} key={item.id} src={item.image} alt="Doadores" />
            ) )}
          </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  
  const donaters = await firebase.firestore()
  .collection('users')
  .get();

  const data = JSON.stringify(donaters.docs.map(u => {
    return {
      id: u.id,
      ...u.data(),
    }
  }))


  return {
    props: {
      data
    },
    revalidate: 60 * 60
  }
}