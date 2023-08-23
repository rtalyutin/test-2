// src/components/InputForm.js

import React, { useState } from 'react';

const InputForm = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(apiKey);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        OpenAI Account API Key:
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </label>
      <button type="submit">Check Balance</button>
    </form>
  );
};

export default InputForm;