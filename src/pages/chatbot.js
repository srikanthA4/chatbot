// src/components/Chatbot.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  sendMessage ,addMessage} from '../redux/chatbot/chat.slice';
import { generateAvatar } from '../redux/chatbot/avatar.slice';
import { transcribeVoice } from './voicerecognition';
import { getChatbotResponse, synthesizeSpeech } from './voicesynthesis';
import '../App.css';

const Chatbot = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const avatarUrl = useSelector((state) => state.avatar.avatarUrl);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    dispatch(generateAvatar());
  }, [dispatch]);

//   const handleSendMessage = async () => {
//     dispatch(addMessage({ sender: 'user', text: userInput }));
//     dispatch(sendMessage(userInput));
//     setUserInput('');
//   };

//   const handleVoiceInput = async (audioBlob) => {
//     try {
//       const transcript = await transcribeVoice(audioBlob);
//       setUserInput(transcript);
//       handleSendMessage();
//     } catch (error) {
//       console.error('Voice input failed:', error);
//     }
//   };

  const playVoiceResponse = async (text) => {
    try {
      const audioContent = await synthesizeSpeech(text);
      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audio.play();
    } catch (error) {
      console.error('Voice playback failed:', error);
    }
  };


  const handleSendMessage = async () => {
  
    if (!userInput.trim()) return;
    dispatch(addMessage({ sender: 'user', text: userInput }));
    setUserInput('');
  
    try {
      dispatch(sendMessage(userInput));
      const botResponseText = await getChatbotResponse(userInput); 
    dispatch(addMessage({ sender: 'bot', text: botResponseText }));
      await playVoiceResponse(botResponseText);
    } catch (error) {
      console.error('Error in handling the chatbot response:', error);
    }
  };




  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Sorry, your browser does not support speech recognition.');
      return;
    }
  
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US'; 
    recognition.interimResults = false; 
    recognition.maxAlternatives = 1; 
  
    recognition.start();
  
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript); 
  
      // Assuming you have an audio Blob that you want to transcribe
      try {
        const audioBlob = new Blob([transcript], { type: 'audio/wav' }); 
        const finalTranscript = await transcribeVoice(audioBlob); 
        setUserInput(finalTranscript); 
        handleSendMessage(); 
      } catch (error) {
        console.error('Voice input failed:', error);
      }
    };
  
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };
  
    recognition.onend = () => {
      console.log('Speech recognition ended');
    };
  };
  



  return (
    <div className="chatbot-container">
      <div className="avatar">
        <img src={avatarUrl} alt="Chatbot Avatar" />
      </div>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
    <div className="input-area">
  <input
    type="text"
    value={userInput}
    onChange={(e) => setUserInput(e.target.value)}
  />
  <button onClick={handleSendMessage}>Send</button>
  <button onClick={handleVoiceInput}>🎤 Voice Input</button>
</div>
    </div>
  );
};

export default Chatbot;
