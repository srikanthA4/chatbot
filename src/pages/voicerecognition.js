import axios from 'axios';

export const transcribeVoice = async (audioBlob) => {
  try {
    const response = await axios.post('https://southindia.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1', {
      audio: audioBlob,
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_VOICE_RECOGNITION_API_KEY}`,
      }
    });
    return response.data.results[0].alternatives[0].transcript;
  } catch (error) {
    console.error('Error during voice transcription:', error);
    throw error;
  }
};
