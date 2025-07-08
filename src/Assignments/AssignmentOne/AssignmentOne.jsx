import { useState, useEffect } from "react";
import "./AssignmentOne.css";

function AssignmentOne() {
  const [count, setCount] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    } else {
      setShowToast(true);
    }
  };

  // Hide toast after 2 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="counter-container">
      <h1 className="counter-title">Simple Counter</h1>
      <p className="counter-value">Current Count: {count}</p>

      <div className="button-container">
        <button className="increment-button" onClick={increment}>
          Increment
        </button>
        <button className="decrement-button" onClick={decrement}>
          Decrement
        </button>
      </div>

      <div className="assignment-container">
        <p>
          This code teaches React basics by demonstrating how to build a
          simple counter app. It covers creating functional components,
          managing state using the useState hook to remember the counter
          value, and handling user interactions through button click events to
          update the state. Additionally, it introduces JSX, which combines
          HTML-like syntax with JavaScript logic to dynamically display the
          counter value. This example highlights essential concepts for
          building interactive and state-driven applications in React.
        </p>
        <p>
          <span className="bold-text">Bonus:</span> You can enhance this by
          adding an if-else condition to prevent the counter from going below
          zero.
        </p>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="toast-message">
          You can't decrement since it's already at zero! 
          <span className="toast-close" onClick={() => setShowToast(false)}>
            &times;
            </span>
        </div>
      )}
    </div>
  );
}

export default AssignmentOne;
