import axios from 'axios';

export const synthesizeSpeech = async (text) => {
  try {
    const response = await axios.post('https://centralindia.tts.speech.microsoft.com/cognitiveservices/v1', {
      input: { text },
      voice: { languageCode: 'en-US', name: 'en-US-Wavenet-D' },
      audioConfig: { audioEncoding: 'MP3' },
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_VOICE_SYNTHESIS_API_KEY}`,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
      },
      body: `<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='en-US-JessaNeural'>Hello, how can I assist you today?</voice></speak>`,
    });
    return response.data.audioContent; 
  } catch (error) {
    console.error('Error during speech synthesis:', error);
    throw error;
  }
};



export const getChatbotResponse = async (userInput) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_LLM_API_KEY}`, 
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", 
          messages: [{ role: "user", content: userInput }],
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch chatbot response');
      }
  
      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error in fetching chatbot response:', error);
      return 'Sorry, something went wrong.';
    }
  };
