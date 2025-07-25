// src/App.tsx
import React, { useEffect, useRef, useState } from 'react';
import './login.css'; // Import the CSS

export const Login: React.FC = () => {
  const unameRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const btnContainerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLInputElement>(null);

  const [areInputsEmpty, setAreInputsEmpty] = useState(true); // Renamed for clarity
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [buttonPositionIndex, setButtonPositionIndex] = useState(0);

  // Define the possible shift positions for the button
  const positions = ['shift-left', 'shift-top', 'shift-right', 'shift-bottom'];

  /**
   * Checks if the input fields are empty and updates the message and button state.
   */
  const showMsg = () => {
    // Determine if either username or password field is empty
    const isEmpty = (unameRef.current?.value === '' || passRef.current?.value === '');
    setAreInputsEmpty(isEmpty); // Update state based on input emptiness

    if (isEmpty) {
      // If inputs are empty, disable the button and show an error message
      if (btnRef.current) {
        btnRef.current.disabled = true;
      }
      setMessageColor('rgb(218 49 49)'); // Red color for error
      setMessage('Por favor, complete los campos antes de continuar');
    } else {
      // If inputs are filled, enable the button and show a success message
      setMessage('Ahora puedes continuar');
      setMessageColor('#92ff92'); // Green color for success
      if (btnRef.current) {
        btnRef.current.disabled = false;
      }
    }
  };

  /**
   * Shifts the login button's position if the input fields are empty.
   * If the fields are filled, the button will stay in place.
   */
  const shiftButton = () => {
    showMsg(); // Always update message and button state first

    // Only shift the button if the input fields ARE EMPTY
    if (!areInputsEmpty) {
      return; // If inputs are NOT empty, do not shift the button
    }

    // Cycle through the shift positions
    setButtonPositionIndex((prevIndex) => (prevIndex + 1) % positions.length);
  };

  // Effect hook to run showMsg on component mount to set initial state
  useEffect(() => {
    showMsg();
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <div className="main-container centered-flex">
      <div className="form-container">
        <div className="icon fa fa-user"></div>
        <form className="centered-flex" onSubmit={(e) => e.preventDefault()}>
          <div className="title">Iniciar Sesión</div>
          {/* Display messages based on input status */}
          <div className="msg" style={{ color: messageColor }}>{message}</div>
          <div className="field">
            <input
              type="text"
              placeholder="Nombre de Usuario"
              id="uname"
              ref={unameRef}
              onInput={showMsg} // Call showMsg on every input change
            />
            <span className="fa fa-user"></span>
          </div>
          <div className="field">
            <input
              type="password"
              placeholder="Contraseña"
              id="pass"
              ref={passRef}
              onInput={showMsg} // Call showMsg on every input change
            />
            <span className="fa fa-lock"></span>
          </div>
          <div className="action centered-flex">
            {/* Checkbox and "Forget Password" link removed as per user's previous code */}
          </div>
          <div
            className="btn-container"
            // Add mouse and touch event listeners to the button container
            // This ensures the button shifts when hovered/touched if inputs are empty
            onMouseEnter={shiftButton}
            onTouchStart={shiftButton}
            ref={btnContainerRef}
          >
            <input
              type="submit"
              id="login-btn"
              value="Login"
              // Apply shift class if inputs are empty, otherwise apply 'no-shift'
              className={areInputsEmpty ? positions[buttonPositionIndex] : 'no-shift'}
              ref={btnRef}
              // Also add event listeners directly to the button for more responsive shifting
              onMouseEnter={shiftButton}
              onTouchStart={shiftButton}
              disabled={areInputsEmpty} // Disable button if inputs are empty
            />
          </div>
          {/* "Don't have an Account?" link removed as per user's previous code */}
        </form>
      </div>
    </div>
  );
};
