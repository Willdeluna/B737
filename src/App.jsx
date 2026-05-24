
import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import './App.css'
const supabaseUrl = 'https://vtibzkzkyatwbydbagau.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0aWJ6a3preWF0d2J5ZGJhZ2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMTc4MjcsImV4cCI6MjA5MDg5MzgyN30._7OG7-KGZduwUyg0bzWubxSPtgjXpPeMaTsgpGXV8YY'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function App() {
  const [searchNumber, setSearchNumber] = useState('')
  const [searchWord, setSearchWord] = useState('')
  const [status, setStatus] = useState('Ready')
  const [result, setResult] = useState(null)

  async function searchRecord() {
    if (!searchNumber.trim() || !searchWord.trim()) {
      setStatus('Enter 1 number and 1 word')
      setResult(null)
      return
    }

    setStatus('Searching...')

    const { data, error } = await supabase
      .from('simple_lookup')
      .select('*')
      .eq('number_code', Number(searchNumber))
      .ilike('word_code', searchWord.trim())
      .maybeSingle()

    if (error) {
      setStatus(`Error: ${error.message}`)
      setResult(null)
      return
    }

    if (!data) {
      setStatus('No match found')
      setResult(null)
      return
    }

    setResult(data)
    setStatus('Match found')
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Simple Lookup</h1>
        <p style={styles.status}>{status}</p>

        <input
          style={styles.input}
          type="number"
          placeholder="Enter number"
          value={searchNumber}
          onChange={(e) => setSearchNumber(e.target.value)}
        />

        <input
          style={styles.input}
          type="text"
          placeholder="Enter word"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value.toUpperCase())}
        />

        <button style={styles.button} onClick={searchRecord}>
          Search
        </button>

        <div style={styles.resultBox}>
          {result ? (
            <>
              <div><strong>Number:</strong> {result.number_code}</div>
              <div><strong>Word:</strong> {result.word_code}</div>
              <div><strong>Recall:</strong></div>
              <div style={styles.recallText}>{result.recall_text}</div>
            </>
          ) : (
            <div>No result loaded</div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#ff9f1a',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '600px',
    background: '#111',
    border: '1px solid #ff9f1a',
    borderRadius: '12px',
    padding: '20px',
  },
  title: {
    marginTop: 0,
  },
  status: {
    color: '#ffb347',
    marginBottom: '16px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '10px',
    background: '#1a1a1a',
    color: '#ff9f1a',
    border: '1px solid #ff9f1a',
    borderRadius: '8px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#222',
    color: '#ff9f1a',
    border: '1px solid #ff9f1a',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '16px',
  },
  resultBox: {
    background: '#181818',
    border: '1px solid #ff9f1a',
    borderRadius: '8px',
    padding: '14px',
  },
  recallText: {
    marginTop: '8px',
    whiteSpace: 'pre-wrap',
  },
}
