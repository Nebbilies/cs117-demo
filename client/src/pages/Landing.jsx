import { motion, AnimatePresence } from 'motion/react'
import icon from '../assets/favicon.png'
import {redirect, Link, useNavigate} from "react-router-dom";
import {useState} from "react";

const variants = {
    grow: {
        scale: 1.1
    },
    initial: {
        y: [-5, 5],
        rotate: 0,
        transition: {
            type: 'easeInOut',
            delay: 1.2,
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.2,
            repeatType: "reverse"
        }
    }
}

function Landing() {
    const [exiting, setExiting] = useState(false)
    const navigate = useNavigate()
    const handleDemoClick = () => {
        setExiting(true)
    }

    const handleExitComplete = () => {
        if (exiting) {
            navigate('/test')
        }
    }
    return (

        <>
            <AnimatePresence onExitComplete={handleExitComplete}>
                {!exiting && (
                <motion.div
                    className={'flex flex-col items-center justify-center h-screen w-screen z-1'}>
                    <motion.div
                        animate={['initial']}
                        variants={variants}
                        className={'flex flex-col items-center justify-center'}>
                        <motion.div
                            initial={{opacity: 0, y: 100}}
                            animate={{opacity: 1, y: 0, transition:{delay: 0.1, duration: 0.7}}}
                            exit={{opacity: 0, y: 100, transition:{delay: 0.4, duration: 0.7}}}
                            transition={{type: 'spring',  ease: 'easeInOut', }}
                            className={'flex items-center justify-center h-auto z-5'}>
                            <img src={icon} alt="Reacts" className={'text-shadow-lg w-35'}/>
                            <div className={'text-left blue-text ml-3'}>
                                <h1 className={'text-6xl font-black text-shadow-sm'}>TrueMBTI</h1>
                                <p className={'text-2xl text-shadow-sm'}>Tìm hiểu về bạn.</p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{opacity: 0, y: 100, }}
                            animate={{opacity: 1, y: 0, transition:{delay: 0.4, duration: 0.7}}}
                            exit={{opacity: 0, y: 100, transition:{delay: 0.1, duration: 0.7}}}
                            transition={{type: 'spring',  ease: 'easeInOut'}}
                            className={'text-center text-lg text-slate-700 font-bold mt-3 text-shadow-sm cursor-pointer p-3 px-6 rounded-full bg-transparent border-[#7FBFFF] border-2 hover:bg-[#7FBFFF] hover:text-white transition-colors duration-300 ease-in-out'}
                            onClick={handleDemoClick}>
                                Thử demo
                        </motion.div>
                    </motion.div>
                </motion.div>
                    )}
            </AnimatePresence>
            <div
                className={'blob -top-50 left-0 opacity-40'}/>
            <div
                className={'blob top-20 left-2/3 opacity-40 z-2'}/>
            <div
                className={'blob -bottom-0 left-60 opacity-20 overflow-hidden'}/>
            <footer
                className="fixed bottom-4 left-0 w-full text-center text-sm text-slate-400 opacity-70 select-none pointer-events-none">
                © 2025 CS115 Project. Made with <span className="inline-block animate-bounce">☁️</span>
            </footer>
        </>
    )
}

export default Landing;