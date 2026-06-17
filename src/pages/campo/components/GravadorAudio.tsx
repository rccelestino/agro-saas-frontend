// src/pages/campo/components/GravadorAudio.tsx
import { useState, useRef } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  LinearProgress,
  Paper,
  Stack,
  Chip,
  Alert,
} from "@mui/material";
import {
  Mic as MicIcon,
  Stop as StopIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

interface GravadorAudioProps {
  onAudioUpload?: (file: File) => void;
}

export default function GravadorAudio({ onAudioUpload }: GravadorAudioProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setDuration(0);
      setUploaded(false);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Criar arquivo para upload
        const file = new File([audioBlob], `gravacao-${Date.now()}.webm`, { type: 'audio/webm' });
        if (onAudioUpload) {
          onAudioUpload(file);
        }
      };

      mediaRecorder.start(1000); // Captura em chunks de 1s
      setIsRecording(true);
      setIsPaused(false);
      
      // Timer para duração
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const togglePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setDuration(0);
      setUploaded(false);
      audioChunksRef.current = [];
    }
  };

  const uploadRecording = () => {
    if (audioUrl) {
      setUploaded(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box>
      {!audioUrl && !isRecording && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<MicIcon />}
          onClick={startRecording}
          sx={{ borderRadius: 2 }}
        >
          Iniciar Gravação
        </Button>
      )}

      {isRecording && (
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'error.light', borderColor: 'error.main' }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: 'error.main',
                    animation: isPaused ? 'none' : 'pulse 1s infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 1, transform: 'scale(1)' },
                      '50%': { opacity: 0.5, transform: 'scale(0.8)' },
                      '100%': { opacity: 1, transform: 'scale(1)' },
                    },
                  }}
                />
                <Typography variant="body2" fontWeight={500} color="error.main">
                  {isPaused ? '⏸️ Pausado' : '🔴 Gravando...'}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {formatTime(duration)}
              </Typography>
            </Box>

            <LinearProgress 
              variant="determinate" 
              value={Math.min((duration / 60) * 100, 100)} 
              color="error"
              sx={{ height: 6, borderRadius: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant={isPaused ? "contained" : "outlined"}
                color="warning"
                onClick={() => {
                  if (mediaRecorderRef.current) {
                    if (isPaused) {
                      mediaRecorderRef.current.resume();
                      setIsPaused(false);
                    } else {
                      mediaRecorderRef.current.pause();
                      setIsPaused(true);
                    }
                  }
                }}
              >
                {isPaused ? '▶️ Retomar' : '⏸️ Pausar'}
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={stopRecording}
              >
                <StopIcon sx={{ fontSize: 16, mr: 1 }} />
                Parar
              </Button>
            </Box>
          </Stack>
        </Paper>
      )}

      {audioUrl && !uploaded && (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={togglePlayAudio}
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  width: 40,
                  height: 40,
                }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  Áudio gravado
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Duração: {formatTime(duration)}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={uploadRecording}
                startIcon={<CheckCircleIcon />}
              >
                Usar Áudio
              </Button>
              <IconButton
                size="small"
                color="error"
                onClick={deleteRecording}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
            />
            <LinearProgress 
              variant="buffer" 
              value={duration > 0 ? 100 : 0}
              sx={{ height: 4, borderRadius: 2 }}
            />
          </Stack>
        </Paper>
      )}

      {uploaded && (
        <Alert icon={<CheckCircleIcon />} severity="success" sx={{ borderRadius: 2 }}>
          ✅ Áudio enviado com sucesso!
        </Alert>
      )}
    </Box>
  );
}