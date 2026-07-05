import { useState, useEffect } from "react";
import { Lock, Delete, ShieldAlert } from "lucide-react";

function PinLock({ correctPin, onUnlock, onSetupPin }) {
  const [pin, setPin] = useState("");
  const [setupStep, setSetupStep] = useState(correctPin ? "verify" : "setup-first");
  const [tempPin, setTempPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    // Clear error after a short delay
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  // Process PIN when it reaches 4 digits
  useEffect(() => {
    const triggerError = (msg) => {
      setErrorMsg(msg);
      setShake(true);
      setPin("");
      setTimeout(() => setShake(false), 300);
    };

    if (pin.length === 4) {
      const timer = setTimeout(() => {
        if (setupStep === "verify") {
          if (pin === correctPin) {
            onUnlock();
          } else {
            triggerError("Incorrect PIN. Please try again.");
          }
        } else if (setupStep === "setup-first") {
          setTempPin(pin);
          setPin("");
          setSetupStep("setup-confirm");
        } else if (setupStep === "setup-confirm") {
          if (pin === tempPin) {
            onSetupPin(pin);
            onUnlock();
          } else {
            triggerError("PINs do not match. Restarting setup.");
            setPin("");
            setTempPin("");
            setSetupStep("setup-first");
          }
        }
      }, 150); // Small delay to let the user see the 4th dot activated

      return () => clearTimeout(timer);
    }
  }, [pin, correctPin, onUnlock, onSetupPin, setupStep, tempPin]);

  const handleKeyPress = (num) => {
    if (pin.length >= 4) return;
    setPin((prev) => prev + num);
  };

  const handleClear = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const getHeading = () => {
    switch (setupStep) {
      case "verify":
        return "Enter Vault PIN";
      case "setup-first":
        return "Set Vault Passcode";
      case "setup-confirm":
        return "Confirm Vault Passcode";
      default:
        return "Secure Vault Lock";
    }
  };

  const getSubheading = () => {
    switch (setupStep) {
      case "verify":
        return "Enter your 4-digit PIN to access documents";
      case "setup-first":
        return "Create a 4-digit PIN to secure your documents locally";
      case "setup-confirm":
        return "Please re-enter your 4-digit PIN to confirm";
      default:
        return "Security Locked";
    }
  };

  return (
    <div className="pin-lock-overlay">
      <div className="pin-lock-container">
        <div className="pin-lock-icon">
          <Lock size={32} />
        </div>

        <h2>{getHeading()}</h2>
        <p>{getSubheading()}</p>

        <div className={`pin-dots ${shake ? "pin-error-msg" : ""}`} style={shake ? { animation: "shake 0.3s ease-in-out" } : {}}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`pin-dot ${i < pin.length ? "active" : ""}`}
            />
          ))}
        </div>

        {errorMsg && (
          <div className="pin-error-msg">
            <ShieldAlert size={14} style={{ marginRight: 6, display: "inline-block", verticalAlign: "middle" }} />
            <span style={{ verticalAlign: "middle" }}>{errorMsg}</span>
          </div>
        )}

        <div className="pin-keyboard">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              className="pin-key"
              onClick={() => handleKeyPress(num.toString())}
            >
              {num}
            </button>
          ))}
          <button
            className="pin-key btn-clear"
            onClick={() => {
              setPin("");
              setTempPin("");
              if (!correctPin) setSetupStep("setup-first");
            }}
          >
            Reset
          </button>
          <button
            className="pin-key"
            onClick={() => handleKeyPress("0")}
          >
            0
          </button>
          <button
            className="pin-key btn-clear"
            onClick={handleClear}
          >
            <Delete size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PinLock;
