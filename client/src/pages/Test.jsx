import {motion, AnimatePresence} from "motion/react";
import {useEffect, useRef, useState} from "react";
import mbtiData from "../data/mbti_data.json";
import {Link} from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const questionSet = [
    'Sau một ngày mệt mỏi, bạn sẽ nạp lại năng lượng bằng cách nào?',
    'Bạn có thường viết nhật ký, quan sát cuộc sống của mình không? Nếu có, việc này giúp gì cho bạn?',
    'Bạn có thấy hứng thú khi tiếp xúc với điều mới mẻ không? Vì sao?',
    'Bạn có thích được người khác chú ý không? Nếu ý kiến bản thân bị phớt lờ, bạn cảm thấy như thế nào?',
    'Bạn an ủi cảm xúc của mình khi thất bại bằng cách nào?',
    'Nếu một người bạn của bạn có một chuyện buồn, bạn sẽ làm gì?',
    'Bạn có thấy vui khi người khác thất bại không?',
    'Đối với bạn, bạn bè có quan trọng không? Bạn có nghĩ mình thực sự cần bạn bè không?',
    'Nỗi sợ/ Nỗi lo lắng mà bạn thường hay phải đối mặt là gì?',
    'Trong 1 nhóm bạn bè, vai trò của bạn là gì?'
]

function Result({result}) {
    const [data, setData] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showInfo, setShowInfo] = useState(false);
    const [mouseDisabled, setMouseDisabled] = useState(false);
    const mouseDisabledRef = useRef(false);
    const infoFields = ['description', 'strength', 'weakness', 'specialty', 'career', 'challenge', 'group_role', 'concern'];
    const infoTitles = ['Tính cách', 'Điểm mạnh', 'Điểm yếu', 'Năng khiếu', 'Sự nghiệp', 'Thử thách', 'Vai trò trong nhóm', 'Lo ngại'];
    useEffect(() => {
        setData(mbtiData.find(item => item.type === result));
        setTimeout(() => {
            setShowInfo(true);
        }, 1000);
    }, [result])
    const handleNextInfo = () => {
        setShowInfo(false);
        setTimeout(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % infoFields.length);
            setShowInfo(true);
        }, 600);
    };
    const handlePrevInfo = () => {
        setShowInfo(false);
        setTimeout(() => {
            setCurrentIndex(prevIndex => (prevIndex - 1 + infoFields.length) % infoFields.length);
            setShowInfo(true);
        }, 600);
    }
    return (
        <>
        <motion.div
            initial={{opacity: 0, y: 100}}
            animate={{opacity: 1, y: 0, transition: {type: 'spring', duration: 1.5}}}
            exit={{opacity: 0, y: 100, transition: {delay: 0.1, duration: 1}}}
            className={'absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/3 w-3xl text-center pointer-events-none'}>
            <h1 className={`text-7xl blue-text text-shadow-sm text-center font-black`}>
                {result}
            </h1>
            <h4 className={`text-2xl font-bold text-center blue-text mt-2`}>
                {data ? data.full_name : 'Không tìm thấy kết quả.'}
            </h4>
        </motion.div>
            <AnimatePresence>
                {showInfo && (
                    <motion.div
                        initial={{opacity: 0,}}
                        animate={{opacity: 1, transition: {type: 'spring', duration: 1}}}
                        exit={{opacity: 0, transition: {type: 'spring', duration: 1}}}
                    >

                    <motion.div
                        className={'mt-4 w-3xl text-center'}>
                        <h3 className={'text-3xl font-bold text-gray-700 mb-2'}>
                            {infoTitles[currentIndex]}
                        </h3>
                        <p className={'text-lg font-semibold text-gray-600'}>
                            {data ? data[infoFields[currentIndex]] : 'Không có thông tin.'}
                        </p>
                    </motion.div>

                    <div className={'navigation-buttons flex items-center justify-center mt-4'}>
                        <motion.button
                            className={'bg-[#7FBFFF] text-white font-bold py-2 px-4 rounded-full mr-4 hover:bg-[#6FAFD0] transition-colors duration-300 cursor-pointer'}
                            onClick={handlePrevInfo}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}>
                            Trước
                        </motion.button>
                        <motion.button
                            className={'bg-[#7FBFFF] text-white font-bold py-2 px-4 rounded-full hover:bg-[#6FAFD0] transition-colors duration-300 cursor-pointer'}
                            onClick={handleNextInfo}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}>
                            Tiếp theo
                        </motion.button>
                    </div>
                    </motion.div>
            )}
            </AnimatePresence>
        </>
    )
}

function Test() {
    const [intro, setIntro] = useState(true);
    const [showQuestions, setShowQuestions] = useState(false);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [charError, setCharError] = useState(true);
    const [answer, setAnswer] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [finalSentence, setFinalSentence] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState('');
    const baseTimeout = 4000;
    const handlePredict = async (sentence) => {
        try {
            const response = await fetch(`${apiUrl}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({text: sentence}),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setResult(data.mbti);
            setShowResult(true);
        } catch (error) {
            console.error('Error fetching prediction:', error);
        }
    }
    const handleNextQuestion = () => {
        setFinalSentence(finalSentence + ' ' + answer)
        setShowQuestions(false);
        setTimeout(() => {
            if (questionIndex < questionSet.length - 1) {
                setQuestionIndex(questionIndex + 1);
                setShowQuestions(true);
                setCharError(true);
                setAnswer('');
                setWordCount(0);
            } else {
                handlePredict(finalSentence);
                setShowQuestions(false);
            }
        }, 1100);
    }
    const onAnswerChange = (e) => {
        const input = e.target.value;
        setAnswer(input);
        const length = input.split(' ').filter(word => word.length > 0).length
        setWordCount(length);
        if (length < 10) {
            setCharError(true);
        } else {
            setCharError(false);
        }
    }
    useEffect(() => {
        setTimeout(
            () => {
                setIntro(false);
            },
            baseTimeout
        )
        setTimeout(() => {
            setShowQuestions(true);
            setQuestionIndex(0);
        }, baseTimeout + 1500)
    }, []);
    return (
        <>
            <AnimatePresence>
                <Link to={'/'} className={'absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors duration-300 cursor-pointer text-lg font-semibold z-10'}>
                    Back
                </Link>
                <motion.div
                    className={'flex flex-col items-center justify-center h-screen w-screen z-1'}
                >
                    <AnimatePresence>
                        {intro &&
                            <motion.div
                                className={'text-left blue-text ml-3 w-xl '}
                            >
                                <motion.h1
                                    initial={{opacity: 0, y: 100}}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: {type: 'spring', delay: 0.1, duration: 1}
                                    }}
                                    exit={{opacity: 0, y: 0, transition: {delay: 0.1, duration: 1}}}
                                    className={'text-4xl font-black text-shadow-sm '}>
                                    Để tìm tính cách MBTI của mình, hãy trả lời 10 câu hỏi sau.
                                </motion.h1>
                                <motion.h4
                                    initial={{opacity: 0, y: 0}}
                                    animate={{opacity: 1, y: 0, transition: {delay: 1, duration: 0.7}}}
                                    exit={{opacity: 0, y: 0, transition: {delay: 0.1, duration: 0.7}}}
                                    className={'text-xl text-shadow-sm'}>
                                    Trả lời theo quan điểm, cảm nhận và trải nghiệm của bạn, mỗi câu trả lời
                                    bao gồm ít nhất 10 từ.
                                </motion.h4>
                            </motion.div>
                        }
                    </AnimatePresence>
                    <AnimatePresence>
                        {!intro && showQuestions && (
                            <div className={'w-fit flex flex-col items-center justify-center'}>
                                <motion.h1
                                    initial={{opacity: 0,}}
                                    animate={{opacity: 1, transition: {type: 'spring', duration: 1.5}}}
                                    exit={{opacity: 0, transition: {type: 'spring', duration: 1.5}}}
                                    className={'text-2xl font-black text-shadow-sm text-gray-600'}>
                                    {questionSet[questionIndex]}
                                </motion.h1>
                                <motion.div className={'w-full flex flex-col items-start justify-center'}
                                            initial={{opacity: 0}}
                                            animate={{
                                                opacity: 1,
                                                transition: {type: 'spring', delay: 0.4, duration: 1}
                                            }}
                                            exit={{opacity: 0, transition: {type: 'spring', duration: 1}}}>
                                    <motion.textarea
                                        id={'answer-input'}
                                        className={'mt-4 p-2 border border-gray-400 rounded-lg w-full h-25 resize-none focus:outline-none focus:ring-2 focus:ring-[#7FBFFF] focus:border-transparent text-gray-700'}
                                        type="text"
                                        placeholder="Nhập câu trả lời của bạn..."
                                        value={answer}
                                        minLength={25}
                                        onChange={(e) => onAnswerChange(e)}
                                    />
                                    <div className={'mt-2 text-sm text-gray-500'}>
                                        {wordCount < 10 && (
                                            <span className={'text-red-500 font-semibold'}>
                                                Bạn cần nhập ít nhất 10 từ.
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1, transition: {type: 'spring', delay: 0.4, duration: 1}}}
                                    exit={{opacity: 0, transition: {type: 'spring', duration: 1}}}
                                    className={`${charError ? 'pointer-events-none border-gray-300 text-gray-300 text-shadow-2xs' : 'cursor-pointer border-[#7FBFFF] text-slate-700 text-shadow-sm'} mt-2 p-2 w-48 text-center text-lg font-bold px-6 rounded-full bg-transparent border-2 hover:bg-[#7FBFFF] hover:text-white transition-colors duration-300 ease-in-out`}
                                    onClick={handleNextQuestion}>
                                    Tiếp tục
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {showResult && (

                                <Result result={result}/>

                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
            <div
                className={'blob -top-50 left-0 opacity-40'}/>
            <div
                className={'blob top-20 left-2/3 opacity-40 z-2'}/>
            <div
                className={'blob -bottom-0 left-60 opacity-20 overflow-hidden'}/>
            <footer
                className="fixed bottom-4 left-0 w-full text-center text-sm text-slate-400 opacity-70 select-none pointer-events-none">
                © 2025 CS117 Project. Made with <span className="inline-block animate-bounce">☁️</span>
            </footer>
        </>
    );
}

export default Test;