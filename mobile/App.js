import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, ScrollView } from 'react-native';
import Constants from 'expo-constants';

const API_BASE = Constants.expoConfig?.extra?.apiBase || 'https://your-backend.example.com';

export default function App() {
  const [ind, setInd] = useState(null);
  const [pred, setPred] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchIndicators(); }, []);

  async function fetchIndicators() {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/indicators/NSE:TCS`);
      const j = await r.json();
      setInd(j);
    } catch (e) {
      console.warn('Failed to fetch indicators', e);
      setInd(null);
    } finally {
      setLoading(false);
    }
  }

  async function getPrediction() {
    if (!ind) {
      alert('Indicators not loaded yet');
      return;
    }
    setLoading(true);
    try {
      const features = [
        ind?.dma44_rising ? 1 : 0,
        ind?.oi || 0,
        ind?.volume || 0,
        ind?.rsi || 50,
        (ind?.ma_short || 0) - (ind?.ma_long || 0)
      ];
      const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: 'NSE:TCS', features })
      });
      const j = await res.json();
      setPred(j);
    } catch (e) {
      console.warn('Predict failed', e);
      setPred(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>AI Trading — Demo</Text>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 16 }} />}

      <View style={{ marginTop: 20 }}>
        <Button title="Refresh Indicators" onPress={fetchIndicators} />
      </View>

      {ind ? (
        <View style={{ marginTop: 20 }}>
          <Text>Symbol: {ind.symbol}</Text>
          <Text>DMA44 rising: {String(ind.dma44_rising)}</Text>
          <Text>OI: {ind.oi}</Text>
          <Text>Volume: {ind.volume}</Text>
          <Text>RSI: {ind.rsi}</Text>
        </View>
      ) : (
        <Text style={{ marginTop: 12 }}>No indicators loaded — backend must be running or set API_BASE.</Text>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Get Prediction" onPress={getPrediction} />
      </View>

      {pred && (
        <View style={{ marginTop: 20 }}>
          <Text>Recommendation: {pred.recommendation}</Text>
          <Text>Buy: {pred.buy_prob}</Text>
          <Text>Hold: {pred.hold_prob}</Text>
          <Text>Sell: {pred.sell_prob}</Text>
        </View>
      )}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}
