import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import Link from 'next/link'
import { useState, FormEvent } from 'react'
import {format, formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Head from 'next/head'
import styles from './styles.module.scss'
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock, FiX } from 'react-icons/fi'
import { SupportButton } from '@/components/SupportButton'
import firebase from '../../services/FireBaseConnection'

type TaskList = {
    created: string | Date;
    createdFormated?: string;
    tarefa: string;
    userId: string;
    nome: string;
    id: string;
}

interface BoardProps {
    user: {
        id: string;
        nome: string;
        vip: string;
        lastDonate: string | Date;
    }
    data: string;
}

export default function Board({ user, data }: BoardProps) {
    const [input, setInput] = useState('')
    const [messageErro, setMessageErro] = useState(false)
    const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data))

    const [taskEdit, setTaskEdit] = useState<TaskList | null>(null) 

    const handleAddTask = async (e: FormEvent) => {
        e.preventDefault()

        if(input === '') {
            setMessageErro(true)
            return;
        }

        if(taskEdit) {
            await firebase.firestore()
            .collection('tarefas')
            .doc(taskEdit.id)
            .update({
                tarefa: input
            })
            .then(() => {
                let data = taskList
                let taskIndex = taskList.findIndex(item => item.id === taskEdit.id)

                data[taskIndex].tarefa = input

                setTaskList(data)
                setTaskEdit(null)
                setInput('')
            })

            return
        }

        await firebase.firestore().collection('tarefas')
        .add({
            created: new Date(),
            tarefa: input,
            userId: user.id,
            nome: user.nome
        })
        .then((doc) => {
            console.log('Tarefa cadastrada com sucesso!')

            let data = {
                id: doc.id,
                created: new Date(),
                createdFormated: format(new Date(), 'dd MMMM yyyy'),
                tarefa: input,
                nome: user.nome
            }

            setTaskList([...taskList, data])
            setMessageErro(false)
            setInput('')
        })
        .catch((err) => {
            console.log('Erro ao cadastrar', err)
        })
    }

    const handleDelete = async (id: string) => {
        await firebase.firestore().collection('tarefas').doc(id)
        .delete()
        .then(() => {
            console.log('Deletado com sucesso')
            let taskDeleted = taskList.filter( item => {
                return (item.id !== id)
            } )
            setTaskList(taskDeleted)
        })
        .catch((error) => {
            console.log(`Erro ao deletar ${error}`)
        })
    }

    const handleEditTask = (task: TaskList) => {
        setTaskEdit(task)
        setInput(task.tarefa)
    }

    const hendleCancelEdit = () => {
        setInput('')
        setTaskEdit(null)
    }

    // const clearInput = (e: FormEvent) => {
    //     if (e.target) {
    //         setMessageErro(false)
    //       }
    // }

    return (
        <>
            <Head>
                <title>Boards</title>
            </Head>
            <main className={styles.container}>
                {taskEdit && (
                    <span className={styles.warnText}>
                        Você está editanto uma tarefa
                        <button title='Cancelar edição' onClick={hendleCancelEdit}>
                            <FiX size={30} color='#ff3636'/>
                        </button>
                    </span>
                    )
                }
                <form onSubmit={handleAddTask}>
                    <input
                        type="text"
                        className={messageErro ? styles.taskNameError : ''}
                        placeholder='Digite sua tarefa'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={() => setMessageErro(false)}
                    />
                    <button type="submit">
                        <FiPlus size={25} color='#14181f' />
                    </button>
                </form>
                {messageErro && <span className={styles.messageError}>Preencha o nome da tarefa.</span>}
                <h1>Você tem <span>{taskList.length}</span> {taskList.length > 1 ? 'tarefas': 'tarefa'}.</h1>
                <section>
                    {
                        taskList.map(task => (
                            <article key={task.id} className={styles.taskList}>
                                <Link href={`/board/${task.id}`}>
                                    <p>{task.tarefa}</p>
                                </Link>
                                
                                <div className={styles.actions}>
                                    <div>
                                        <div>
                                            <FiCalendar size={20} color='#FF8800' />
                                            <time>{task.createdFormated}</time>
                                        </div>
                                        {
                                            user.vip && (
                                                <button onClick={() => handleEditTask(task)}>
                                                    <FiEdit2 size={20} color='#FFF' />
                                                </button>
                                            )
                                        }
                                    </div>
                                    <button onClick={() => handleDelete(task.id)}>
                                        <FiTrash size={20} color='#ff3636' />
                                        <span>Excluir</span>
                                    </button>
                                </div>
                            </article>
                        ))
                    }
                </section>
            </main>
            {
                 user.vip && (
                    <div className={styles.vipContainer}>
                        <h3>Obrigado por apoiar esse projeto</h3>
                        <div>
                            <FiClock size={28} color='#fff' />
                            <time>
                                Última doação foi a {formatDistance(new Date(user.lastDonate), new Date(), {locale: ptBR})}.
                            </time>
                        </div>
                    </div>
                 )
            }
            
            <SupportButton />
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, }) => {
    const session = await getSession({ req });

    if(!session?.id) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const task = await firebase.firestore().collection('tarefas')
    .where('userId', '==', session?.id)
    .orderBy('created', 'asc').get();

    const data = JSON.stringify(task.docs.map( u => {
        return {
            id: u.id,
            createdFormated: format(u.data().created.toDate(), 'dd MMMM yyyy'),
            ...u.data(),
        }
    }))

    const user = {
        nome: session?.user.name,
        id: session?.id,
        vip: session?.vip,
        lastDonate: session?.lastDonate
        
    }

    return {
        props: {
            user,
            data
        }
    }
}