import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CryptoJS from 'crypto-js';
import Menu from '../components/Menu';

// Opciones de criptografía
const cryptosystems = [
  {
    id: 1,
    name: 'AES',
    description: 'Cifrado simétrico usando el algoritmo AES.',
  },
  {
    id: 2,
    name: 'RSA',
    description: 'Cifrado asimétrico usando el algoritmo RSA.',
  },
  { id: 3, name: 'SHA-256', description: 'Función de hash usando SHA-256.' },
  {
    id: 4,
    name: 'DES',
    description: 'Cifrado simétrico usando el algoritmo DES.',
  },
  {
    id: 5,
    name: 'Blowfish',
    description: 'Cifrado simétrico usando el algoritmo Blowfish.',
  },
];

const Cryptography = () => {
  // Estado para almacenar el método de cifrado seleccionado (AES, RSA, SHA-256, etc.)
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  // Estado para almacenar el texto de entrada ingresado por el usuario para cifrar o descifrar
  const [inputText, setInputText] = useState('');

  // Estado para almacenar el resultado del cifrado o descifrado, que se mostrará al usuario
  const [outputText, setOutputText] = useState('');

  // Estado para almacenar las claves RSA (pública y privada) generadas, necesarias para cifrado y descifrado con RSA
  const [rsaKeys, setRsaKeys] = useState({ publicKey: null, privateKey: null });

  // Hook useEffect que se ejecuta cuando cambian las claves RSA o el método de cifrado seleccionado
  useEffect(() => {
    // Verifica si el método de cifrado seleccionado es RSA (código 2)
    // y si las claves pública y privada no han sido generadas
    if (selectedCrypto === 2 && !rsaKeys.publicKey && !rsaKeys.privateKey) {
      // Si se cumplen las condiciones, se generan las claves RSA
      generateRSAKeys();
    }
  }, [rsaKeys.privateKey, rsaKeys.publicKey, selectedCrypto]); // Dependencias: se vuelve a ejecutar cuando cambian estas variables

  // Genera claves públicas y privadas RSA
  const generateRSAKeys = async () => {
    // Solicita la generación de un par de claves RSA asíncronamente
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP', // Especifica el algoritmo RSA-OAEP para cifrado asimétrico
        modulusLength: 2048, // Define la longitud de la clave en bits (2048 es estándar para RSA)
        publicExponent: new Uint8Array([1, 0, 1]), // Define el exponente de la clave pública (65537 en notación hexadecimal)
        hash: 'SHA-256', // Especifica que se utilizará SHA-256 como función hash
      },
      true, // La clave es exportable, permitiendo su uso fuera del navegador si se desea
      ['encrypt', 'decrypt'] // Define las operaciones permitidas con la clave: cifrar y descifrar
    );

    // Guarda las claves públicas y privadas en el estado para su uso posterior
    setRsaKeys({
      publicKey: keyPair.publicKey, // Almacena la clave pública
      privateKey: keyPair.privateKey, // Almacena la clave privada
    });
  };

  const handleSelect = (id) => {
    setSelectedCrypto(id);
    setOutputText('');
    setInputText('');
  };

  const handleEncrypt = async () => {
    // Verifica si el texto de entrada está vacío después de eliminar los espacios en blanco
    if (!inputText.trim()) {
      setOutputText('Por favor ingrese un texto.'); // Muestra un mensaje de error si el texto está vacío
      return; // Sale de la función si no hay texto para cifrar
    }

    let encrypted = ''; // Declara una variable para almacenar el texto cifrado

    // Verifica el tipo de cifrado seleccionado y realiza el cifrado correspondiente
    switch (selectedCrypto) {
      case 1: // Caso para AES
        // Cifra el texto de entrada con AES usando una clave secreta
        // Ejemplo: Almacenar contraseñas de usuario de forma segura
        encrypted = CryptoJS.AES.encrypt(inputText, 'secret-key').toString();
        break;

      case 2: // Caso para RSA (Cifrado asimétrico con SubtleCrypto)
        // Llama a la función rsaEncrypt para cifrar el texto de entrada con la clave pública RSA
        // Ejemplo: Enviar mensajes confidenciales entre usuarios, asegurando que solo el destinatario pueda leerlos
        encrypted = await rsaEncrypt(inputText, rsaKeys.publicKey);
        break;

      case 3: // Caso para SHA-256 (Hashing)
        // Aplica el algoritmo SHA-256 para hacer un hash del texto de entrada
        // Ejemplo: Verificar la integridad de archivos o datos, o almacenar contraseñas de manera que no puedan ser revertidas
        encrypted = CryptoJS.SHA256(inputText).toString(CryptoJS.enc.Hex);
        break;

      case 4: // Caso para DES
        // Cifra el texto de entrada con DES usando una clave secreta
        // Ejemplo: Proteger datos sensibles en sistemas heredados (Ya no se recomienda debido a su debilidad)
        encrypted = CryptoJS.DES.encrypt(inputText, 'secret-key').toString();
        break;

      case 5: // Caso para Blowfish
        // Comprueba que el texto de entrada tenga al menos un carácter
        if (inputText.length < 1) {
          setOutputText('El texto debe tener al menos 1 carácter.'); // Muestra un mensaje de error si el texto es demasiado corto
          return; // Sale de la función si el texto no tiene la longitud mínima
        }
        // Cifra el texto con Blowfish usando una clave secreta
        // Ejemplo: Cifrado de datos en aplicaciones donde se requiere un buen balance entre velocidad y seguridad
        encrypted =
          selectedCrypto === 1
            ? CryptoJS.AES.encrypt(inputText, 'secret-key').toString()
            : selectedCrypto === 6
            ? CryptoJS.DES.encrypt(inputText, 'secret-key').toString()
            : CryptoJS.Blowfish.encrypt(inputText, 'secret-key').toString();
        break;

      default:
        // Si no se ha seleccionado un método válido, muestra un mensaje de selección
        encrypted = 'Seleccione un método';
    }

    // Actualiza el estado para mostrar el texto cifrado o el mensaje de selección
    setOutputText(encrypted);
  };

  const handleDecrypt = async () => {
    // Verifica si el texto de entrada está vacío después de eliminar los espacios en blanco
    if (!inputText.trim()) {
      setOutputText('Por favor ingrese un texto.'); // Muestra un mensaje de error si el texto está vacío
      return; // Sale de la función si no hay texto para desencriptar
    }

    let decrypted = ''; // Declara una variable para almacenar el texto desencriptado

    // Verifica el tipo de cifrado seleccionado y realiza la desencriptación correspondiente
    switch (selectedCrypto) {
      case 1: {
        // Caso para AES
        try {
          // Intenta desencriptar el texto usando AES y la clave secreta
          const bytes = CryptoJS.AES.decrypt(outputText, 'secret-key');
          decrypted = bytes.toString(CryptoJS.enc.Utf8); // Convierte los bytes desencriptados en una cadena de texto
          if (!decrypted) {
            // Si la desencriptación falla, muestra un mensaje de error
            decrypted =
              'Error: No se pudo desencriptar, verifique la clave y el texto.';
          }
        } catch (error) {
          // Captura y muestra cualquier error que ocurra durante la desencriptación
          decrypted = 'Error durante la desencriptación: ' + error.message;
        }
        break;
      }

      case 2: // Caso para RSA (Desencriptación con SubtleCrypto)
        // Llama a la función rsaDecrypt para desencriptar el texto usando la clave privada RSA
        decrypted = await rsaDecrypt(outputText, rsaKeys.privateKey);
        break;

      case 3: // Caso para SHA-256
        // Informa al usuario que el hash SHA-256 no puede ser desencriptado
        decrypted = 'SHA-256 es un hash y no puede ser desencriptado.';
        break;

      case 4: {
        // Caso para DES
        try {
          // Intenta desencriptar el texto usando DES y la clave secreta
          const bytes = CryptoJS.DES.decrypt(outputText, 'secret-key');
          decrypted = bytes.toString(CryptoJS.enc.Utf8); // Convierte los bytes desencriptados en texto
          if (!decrypted) {
            // Si la desencriptación falla, muestra un mensaje de error
            decrypted =
              'Error: No se pudo desencriptar, verifique la clave y el texto.';
          }
        } catch (error) {
          // Captura y muestra cualquier error que ocurra durante la desencriptación
          decrypted = 'Error durante la desencriptación: ' + error.message;
        }
        break;
      }

      case 5: {
        // Caso para Blowfish
        try {
          // Intenta desencriptar el texto usando Blowfish y la clave secreta
          const bytes = CryptoJS.Blowfish.decrypt(outputText, 'secret-key');
          decrypted = bytes.toString(CryptoJS.enc.Utf8); // Convierte los bytes desencriptados en texto
          if (!decrypted) {
            // Si la desencriptación falla, muestra un mensaje de error
            decrypted =
              'Error: No se pudo desencriptar, verifique la clave y el texto.';
          }
        } catch (error) {
          // Captura y muestra cualquier error que ocurra durante la desencriptación
          decrypted = 'Error durante la desencriptación: ' + error.message;
        }
        break;
      }

      default:
        // Muestra un mensaje si el método de desencriptación seleccionado no está disponible
        decrypted = 'Desencriptación no disponible para este método';
    }

    // Actualiza el estado para mostrar el texto desencriptado o el mensaje de error correspondiente
    setOutputText(decrypted);
  };

  // Función para cifrar con RSA usando la clave pública
  const rsaEncrypt = async (text, publicKey) => {
    // Crea un TextEncoder para convertir el texto en bytes
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(text); // Convierte el texto en una secuencia de bytes UTF-8

    // Cifra los bytes usando RSA-OAEP con la clave pública proporcionada
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP', // Algoritmo de cifrado
      },
      publicKey, // Clave pública para el cifrado
      encodedText // Texto codificado en bytes
    );

    // Convierte el ArrayBuffer en una cadena de caracteres codificada en base64
    return window.btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  };

  // Función para descifrar con RSA usando la clave privada
  const rsaDecrypt = async (encryptedText, privateKey) => {
    // Crea un TextDecoder para convertir bytes en texto después de descifrar
    const decoder = new TextDecoder();
    // Convierte el texto cifrado en base64 a un Uint8Array
    const encryptedData = Uint8Array.from(atob(encryptedText), (c) =>
      c.charCodeAt(0)
    );

    // Descifra los bytes usando RSA-OAEP con la clave privada proporcionada
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP', // Algoritmo de descifrado
      },
      privateKey, // Clave privada para el descifrado
      encryptedData // Datos cifrados en forma de Uint8Array
    );

    // Decodifica los bytes descifrados en una cadena de texto y la devuelve
    return decoder.decode(decrypted);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-10">Menú de Criptografía</h1>

      {/* Menú de opciones de criptografía */}
      <ul className="flex space-x-6 mb-8">
        {cryptosystems.map((item) => (
          <Menu
            key={item.id}
            item={item}
            selectedCrypto={selectedCrypto}
            handleSelect={handleSelect}
          />
        ))}
      </ul>

      {/* Sección dinámica */}
      {selectedCrypto !== null && (
        <motion.div
          key={selectedCrypto}
          className="p-6 bg-gray-800 rounded-lg text-center w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-4">
            Método seleccionado:{' '}
            {cryptosystems.find((crypto) => crypto.id === selectedCrypto).name}
          </h2>
          <p className="text-gray-300 mb-6">
            {
              cryptosystems.find((crypto) => crypto.id === selectedCrypto)
                .description
            }
          </p>

          {/* Entrada de texto */}
          <input
            type="text"
            placeholder="Ingrese texto"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-900 text-white border border-gray-700 rounded"
          />

          {/* Botones para encriptar y desencriptar */}
          <div className="flex space-x-4 justify-center mb-4">
            <button
              className="py-2 px-4 bg-blue-600 rounded hover:bg-blue-500"
              onClick={handleEncrypt}
            >
              Encriptar
            </button>
            <button
              className="py-2 px-4 bg-red-600 rounded hover:bg-red-500"
              onClick={handleDecrypt}
            >
              Desencriptar
            </button>
          </div>

          {/* Resultado */}
          {outputText && (
            <motion.div
              className="p-4 bg-gray-700 rounded-lg text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xl font-semibold">Resultado:</h3>
              <p className="text-gray-300 break-words overflow-auto max-h-48">
                {outputText}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Cryptography;
