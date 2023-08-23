import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import InputForm from './components/InputForm';
import Balance from './components/Balance';
import openai from './services/openai';

const App = () => {
  const [apiKey, setApiKey] = useState('');
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (apiKey) {
      openai.getAccountBalance(apiKey)
        .then(response => {
          setBalance(response.data.balance);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [apiKey]);

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  return (
    <div>
      <h1>OpenAI Account Balance</h1>
      <InputForm apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
      {balance !== null && <Balance balance={balance} />}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));