import { useState, useEffect } from 'react';
import { FaComment, FaTimes, FaBook, FaSearch, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';
import './ContactFloat.css';

export const ContactFloat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickOptions = [
    { text: 'Horario de atención', icon: <FaInfoCircle /> },
    { text: 'Cómo buscar un libro', icon: <FaSearch /> },
    { text: 'Reglas de préstamo', icon: <FaBook /> },
    { text: 'Contactar al bibliotecario', icon: <FaQuestionCircle /> }
  ];

  const botResponses: Record<string, string> = {
    'horario de atención': 'La biblioteca está abierta de lunes a viernes de 8:00 am a 8:00 pm y los sábados de 9:00 am a 2:00 pm.',
    'cómo buscar un libro': 'Puedes buscar libros por título, autor o materia en nuestro catálogo en línea. ¿Necesitas ayuda con algo específico?',
    'reglas de préstamo': 'Los libros se prestan por 15 días renovables. Se permite un máximo de 3 libros por usuario. Hay multas por retraso en la devolución.',
    'contactar al bibliotecario': 'Puedes enviar un correo a biblioteca@upqroo.edu.mx o visitar la mesa de referencia en el primer piso.'
  };

  useEffect(() => {
    if (!isOpen) return;
    
    // Mensaje inicial del bot
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([{ 
          text: '¡Hola! Soy tu asistente de la biblioteca. ¿En qué puedo ayudarte hoy?', 
          isUser: false 
        }]);
      }, 500);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = (text?: string) => {
    const messageToSend = text || inputMessage;
    if (!messageToSend.trim()) return;

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { text: messageToSend, isUser: true }]);
    setInputMessage('');
    setIsTyping(true);

    // Simular respuesta del bot después de un breve retraso
    setTimeout(() => {
      const lowerMessage = messageToSend.toLowerCase();
      let response = 'Lo siento, no entendí tu pregunta. ¿Puedes reformularla o elegir una de estas opciones?';
      
      // Buscar una respuesta coincidente
      for (const key in botResponses) {
        if (lowerMessage.includes(key)) {
          response = botResponses[key];
          break;
        }
      }

      setMessages(prev => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickOption = (option: string) => {
    handleSendMessage(option);
  };

  return (
    <div className="assistant-container">
      {/* Botón flotante principal */}
      <button 
        className="assistant-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente virtual"}
      >
        {isOpen ? <FaTimes /> : <FaComment />}
      </button>

      {/* Interfaz del chat */}
      {isOpen && (
        <div className="assistant-chat">
          <div className="chat-header">
            <h3>Asistente de la Biblioteca</h3>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
          
          <div className="quick-options">
            {quickOptions.map((option, index) => (
              <button 
                key={index}
                className="quick-option"
                onClick={() => handleQuickOption(option.text)}
              >
                {option.icon} {option.text}
              </button>
            ))}
          </div>
          
          <div className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu pregunta..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              className="send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
            >
              <FaComment />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};