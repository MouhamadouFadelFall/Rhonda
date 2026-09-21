/**
 * Multimodal Service: Speech Recognition (STT), Speech Synthesis (TTS), and Screen Capture
 * Fulfills Phase 8 Specifications
 */

// Define SpeechRecognition interface for browser support
interface SpeechRecognitionEventLike {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart?: () => void;
  onresult?: (event: SpeechRecognitionEventLike) => void;
  onerror?: (event: unknown) => void;
  onend?: () => void;
}

export class MultimodalService {
  private recognition: SpeechRecognitionInstance | null = null;
  private isListening = false;
  private isSpeechSynthesisEnabled = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionConstructor =
        (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;

      if (SpeechRecognitionConstructor) {
        this.recognition = new SpeechRecognitionConstructor();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'fr-FR';
      }
    }
  }

  isVoiceInputSupported(): boolean {
    return !!this.recognition;
  }

  startListening(
    onResult: (transcript: string) => void,
    onStatusChange: (listening: boolean) => void,
    onError: (err: string) => void
  ): void {
    if (!this.recognition) {
      onError("La reconnaissance vocale n'est pas supportée par ce navigateur.");
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      onStatusChange(false);
      return;
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      onStatusChange(true);
    };

    this.recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        onResult(transcript);
      }
    };

    this.recognition.onerror = (e) => {
      console.warn('Speech recognition error:', e);
      this.isListening = false;
      onStatusChange(false);
      onError('Microphone inaccessible ou erreur de transcription vocale.');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onStatusChange(false);
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Failed to start speech recognition', e);
      this.isListening = false;
      onStatusChange(false);
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text: string): void {
    if (!this.isSpeechSynthesisEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      // Clean markdown characters before vocalization
      const cleanText = text.replace(/[*#•_`]/g, '').slice(0, 300);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error', e);
    }
  }

  toggleSpeechSynthesis(): boolean {
    this.isSpeechSynthesisEnabled = !this.isSpeechSynthesisEnabled;
    if (!this.isSpeechSynthesisEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    return this.isSpeechSynthesisEnabled;
  }

  getIsSpeechSynthesisEnabled(): boolean {
    return this.isSpeechSynthesisEnabled;
  }

  async captureScreen(): Promise<{ dataUrl: string; width: number; height: number } | null> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getDisplayMedia) {
      throw new Error("L'API de capture d'écran n'est pas supportée dans cet environnement.");
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' } as MediaTrackConstraints,
        audio: false
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      // Stop stream tracks
      stream.getTracks().forEach((track) => track.stop());

      const dataUrl = canvas.toDataURL('image/png');
      return {
        dataUrl,
        width: canvas.width,
        height: canvas.height
      };
    } catch (err) {
      console.warn('Screen capture cancelled or blocked', err);
      return null;
    }
  }
}

export const multimodal = new MultimodalService();
