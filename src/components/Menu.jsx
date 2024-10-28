/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';

const Menu = ({ item, selectedCrypto, handleSelect }) => {
  return (
    <motion.li
      key={item.id}
      className={`cursor-pointer py-2 px-4 rounded-lg transition-colors ${
        selectedCrypto === item.id
          ? 'bg-blue-500 text-white'
          : 'bg-gray-700 text-gray-300'
      }`}
      onClick={() => handleSelect(item.id)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {item.name}
    </motion.li>
  );
};

export default Menu;
