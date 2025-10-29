import React, { useState } from "react";

export default function ConfigModal({ isOpen, onClose, values, onSave }) {
  const [thresholds, setThresholds] = useState(values);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(thresholds);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <h2>Weather Preferences</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Jacket needed when temperature is below:
              <input
                type="number"
                value={thresholds.jacketTemp}
                onChange={(e) =>
                  setThresholds((prev) => ({
                    ...prev,
                    jacketTemp: parseFloat(e.target.value),
                  }))
                }
                step="0.1"
              />
              °C
            </label>
          </div>
          <div className="form-group">
            <label>
              Jacket needed when wind speed is above:
              <input
                type="number"
                value={thresholds.jacketWind}
                onChange={(e) =>
                  setThresholds((prev) => ({
                    ...prev,
                    jacketWind: parseFloat(e.target.value),
                  }))
                }
                step="0.1"
              />
              km/h
            </label>
          </div>
          <div className="form-group">
            <label>
              Gloves needed when temperature is below:
              <input
                type="number"
                value={thresholds.glovesTemp}
                onChange={(e) =>
                  setThresholds((prev) => ({
                    ...prev,
                    glovesTemp: parseFloat(e.target.value),
                  }))
                }
                step="0.1"
              />
              °C
            </label>
          </div>
          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
