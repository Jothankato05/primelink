/**
 * PrimeLink Socket.io hook
 * Connects to backend, streams live sensor data
 * Gracefully falls back to mock data if backend is offline
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://primelink-backend.onrender.com';

export function useSocket({ communityId, onSensorUpdate, onAlertNew, onMapOverview }) {
  const [connected, setConnected] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 5000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setBackendOnline(true);
      console.log('🟢 PrimeLink backend connected');
      if (communityId) socket.emit('subscribe:community', communityId);
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('🔴 PrimeLink backend disconnected — falling back to simulation');
    });

    socket.on('connect_error', () => {
      setBackendOnline(false);
      setConnected(false);
    });

    socket.on('sensor:update', (data) => {
      if (onSensorUpdate) onSensorUpdate(data);
    });

    socket.on('alert:new', (alert) => {
      if (onAlertNew) onAlertNew(alert);
    });

    socket.on('map:overview', (data) => {
      if (onMapOverview) onMapOverview(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [communityId]);

  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { connected, backendOnline, emit };
}
