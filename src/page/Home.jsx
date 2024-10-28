import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <motion.h1
        className="text-5xl font-bold mb-4 flex items-center gap-5"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Proyecto Criptografía
        <Link to="/cryptography">
          <button className="bg-white text-black rounded-md p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="none"
              stroke="currentColor"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </Link>
      </motion.h1>

      <motion.ul
        className="text-xl"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.li variants={item}>Jerónimo Sánchez</motion.li>
        <motion.li variants={item}>Juan Pablo Vásquez</motion.li>
        <motion.li variants={item}>Joel Ferrer</motion.li>
      </motion.ul>
    </div>
  );
};

export default Home;
