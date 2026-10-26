import { useState } from "react";
import SiteNavigation from '../SiteNavigation';
import './Text.css';

const Text = () => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setFeedback(null);
    const upperCaseText = inputText.toUpperCase();

    console.log("Submitted text:", upperCaseText);

    try {
      const result = await fetch("http://192.168.77.77:5000/send-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command: "user_input",
          text: upperCaseText
        }),
      });

      console.log(result);
      if (result.ok) {
        setFeedback({ type: 'success', text: `Message "${upperCaseText}" sent to cube!` });
      } else {
        setFeedback({ type: 'error', text: `Error ${result.status}: Failed to broadcast.` });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', text: 'Connection failed. Please check NodeMCU backend.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setInputText(e.target.value.toUpperCase());
  };

  return (
    <div className="textbox-page">
      <div className="textbox-bg-glow" />
      <SiteNavigation />
      <main className="textbox-main">
        <form onSubmit={handleSubmit} className="textbox-form">
          <div className="textbox-pill">
            <span>Volumetric Text Broadcaster</span>
          </div>
          <h1>
            Send a <span className="title-accent">Message</span>
          </h1>
          <p className="textbox-subtitle">
            Enter custom uppercase text to display across the 3D LED matrix layers.
          </p>

          <label htmlFor="inputText">Message Content</label>
          <input
            type="text"
            id="inputText"
            name="inputText"
            value={inputText}
            onChange={handleChange}
            placeholder="TYPE YOUR MESSAGE..."
            required
            autoComplete="off"
          />

          <button type="submit" disabled={isLoading || !inputText.trim()}>
            {isLoading ? "Broadcasting..." : "Send to Cube →"}
          </button>

          {feedback && (
            <div className={`textbox-feedback ${feedback.type}`}>
              {feedback.text}
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default Text;
