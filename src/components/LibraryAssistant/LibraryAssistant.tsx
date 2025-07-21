import { useState, useEffect } from 'react';
import { FaComment, FaTimes, FaBook, FaSearch, FaQuestionCircle, FaInfoCircle, FaPaperPlane } from 'react-icons/fa';
import './LibraryAssistant.css';

export const LibraryAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickOptions = [
    { text: 'Horario de atención', icon: <FaInfoCircle /> },
    { text: 'Cómo buscar un libro', icon: <FaSearch /> },
    { text: 'Reglas de préstamo', icon: <FaBook /> },
    { text: 'Contactar al bibliotecario', icon: <FaQuestionCircle /> },
    { text: 'Recursos electrónicos', icon: <FaBook /> },
    { text: 'Renovación en línea', icon: <FaBook /> }
  ];

  const botResponses: Record<string, string> = {
    'horario de atención': 'Horario de atención:\nLun-Vie: 09:00 a.m. - 14:00 p.m. / 17:00 p.m. - 20:00 p.m.\nSáb-Dom: Cerrado',
    'cómo buscar un libro': 'Puedes buscar en nuestro catálogo en línea: https://siabuc.ucol.mx/upqroo\nO visita la sección de ayuda para guías detalladas.',
    'reglas de préstamo': 'Préstamo de material:\n- Hasta 3 libros por 3 días\n- 2 renovaciones posibles\n- Renovación debe hacerse el día de vencimiento',
    'contactar al bibliotecario': 'Contáctanos:\n📞 998 283 1859\n✉️ biblioteca@upqroo.edu.mx\n📍 Smza. 255, Mza. 11, Lote 1119-33, 77500 Cancún',
    'recursos electrónicos': 'Recursos disponibles:\n• Base de datos\n• Bibliotecas digitales\n• Revistas electrónicas\n• E-books\n• Diccionarios\n• Normas y guías\n• Formación autodidacta',
    'renovación en línea': 'Para renovar tus préstamos en línea, visita nuestro sistema de gestión o contacta al bibliotecario para asistencia.'
  };

  useEffect(() => {
    if (!isOpen) return;
    
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([{ 
          text: '¡Hola! Soy el asistente de la Biblioteca Virtual Kaxáant. ¿En qué puedo ayudarte hoy?', 
          isUser: false 
        }]);
      }, 500);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = (text?: string) => {
    const messageToSend = text || inputMessage;
    if (!messageToSend.trim()) return;

    setMessages(prev => [...prev, { text: messageToSend, isUser: true }]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerMessage = messageToSend.toLowerCase();
      let response = 'Puedo ayudarte con:\n- Horarios\n- Préstamos\n- Recursos\n- Contacto\n\nElige una opción o escribe tu pregunta.';
      
      for (const key in botResponses) {
        if (lowerMessage.includes(key)) {
          response = botResponses[key];
          break;
        }
      }

      setMessages(prev => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Retraso variable para parecer más natural
  };
 
  const handleQuickOption = (option: string) => {
    handleSendMessage(option);
  };

  return (
    <div className="assistant-container">
      <button 
        className="assistant-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente virtual"}
      >
        {isOpen ? <FaTimes size={24} /> : <FaComment size={24} />}
      </button>

      {isOpen && (
        <div className="assistant-chat">
          <div className="chat-header">
            <h3>Asistente Biblioteca Kaxáant</h3>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
                {msg.text.split('\n').map((line, i) => (
                  <span key={i}>{line}<br/></span>
                ))}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
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
              <FaPaperPlane size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};