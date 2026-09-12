'use client';

import { useState, useEffect } from 'react';
import {
  pertanyaanAPI,
  jawabanAPI,
  filesAPI,
  pesertaAPI,
  checkGISApiConnection,
  getCompleteExamData,
  batchOperations,
  getToken,
  setGISOfficialToken
} from '@/app/utils/gisOfficialAPI';

export default function GISOfficialAPITest() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setTokenState] = useState('');
  const [customToken, setCustomToken] = useState('');

  // Log function to display results
  const log = (message, type = 'info', data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    setResults(prev => [...prev, { timestamp, message, type, data }].slice(-20));
  };

  // Check token on mount
  useEffect(() => {
    const currentToken = getToken();
    setTokenState(currentToken || '');
    log('Current token: ' + (currentToken ? 'Found ✓' : 'Not found ✗'), currentToken ? 'success' : 'error');
  }, []);

  // Test API Connection
  const testConnection = async () => {
    setLoading(true);
    log('Testing GIS Official API connection...', 'info');
    try {
      const result = await checkGISApiConnection();
      if (result.connected) {
        log('✅ API Connected successfully!', 'success');
      } else {
        log('❌ API Connection failed: ' + result.error, 'error');
      }
    } catch (error) {
      log('❌ Connection error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test Pertanyaan API
  const testPertanyaan = async () => {
    setLoading(true);
    log('Testing Pertanyaan API...', 'info');
    try {
      const allPertanyaan = await pertanyaanAPI.getAllPertanyaan();
      log(`✅ Get All Pertanyaan: ${Array.isArray(allPertanyaan) ? allPertanyaan.length : (allPertanyaan.data?.length || 0)} questions found`, 'success', allPertanyaan);
    } catch (error) {
      log('❌ Pertanyaan API error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test Pertanyaan with Answers
  const testPertanyaanWithAnswers = async () => {
    setLoading(true);
    log('Testing Pertanyaan with Answers...', 'info');
    try {
      const data = await pertanyaanAPI.getPertanyaanWithAnswers();
      const count = Array.isArray(data) ? data.length : (data.data?.length || 0);
      log(`✅ Get Pertanyaan with Answers: ${count} questions with answers loaded`, 'success', data);
    } catch (error) {
      log('❌ Pertanyaan with Answers error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test Jawaban API
  const testJawaban = async () => {
    setLoading(true);
    log('Testing Jawaban API...', 'info');
    try {
      const allJawaban = await jawabanAPI.getAllJawaban();
      log(`✅ Get All Jawaban: ${Array.isArray(allJawaban) ? allJawaban.length : (allJawaban.data?.length || 0)} answers found`, 'success', allJawaban);
    } catch (error) {
      log('❌ Jawaban API error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test Files API
  const testFiles = () => {
    setLoading(true);
    log('Testing Files API...', 'info');
    try {
      const fileUrl = filesAPI.getFileUrl('test/image.jpg');
      log(`✅ File URL generated: ${fileUrl}`, 'success');
    } catch (error) {
      log('❌ Files API error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test Peserta API
  const testPeserta = async () => {
    setLoading(true);
    log('Testing Peserta API...', 'info');
    try {
      const allPeserta = await pesertaAPI.getAllPeserta();
      log(`✅ Get All Peserta: ${Array.isArray(allPeserta) ? allPeserta.length : (allPeserta.data?.length || 0)} participants found`, 'success', allPeserta);
    } catch (error) {
      log('❌ Peserta API error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test Complete Exam Data
  const testCompleteData = async () => {
    setLoading(true);
    log('Testing Complete Exam Data...', 'info');
    try {
      const result = await getCompleteExamData();
      if (result.success) {
        log(`✅ Complete exam data loaded successfully`, 'success', result.data);
      } else {
        log('❌ Failed to load complete data: ' + result.error, 'error');
      }
    } catch (error) {
      log('❌ Complete data error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test Batch Operations
  const testBatchOperations = async () => {
    setLoading(true);
    log('Testing Batch Operations...', 'info');
    try {
      const result = await batchOperations.loadExamData();
      if (result.success) {
        const pertanyaanCount = result.pertanyaan?.length || 0;
        const jawabanCount = result.jawaban?.length || 0;
        log(`✅ Batch load complete: ${pertanyaanCount} questions, ${jawabanCount} answers`, 'success', result);
      } else {
        log('❌ Batch operations failed: ' + result.error, 'error');
      }
    } catch (error) {
      log('❌ Batch operations error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test Single Pertanyaan by ID
  const testSinglePertanyaan = async () => {
    setLoading(true);
    log('Testing Single Pertanyaan (ID: 1)...', 'info');
    try {
      const pertanyaan = await pertanyaanAPI.getPertanyaanById(1);
      log('✅ Single pertanyaan loaded', 'success', pertanyaan);
    } catch (error) {
      log('❌ Single pertanyaan error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test Jawaban by Pertanyaan ID
  const testJawabanByPertanyaan = async () => {
    setLoading(true);
    log('Testing Jawaban by Pertanyaan ID (1)...', 'info');
    try {
      const jawaban = await jawabanAPI.getJawabanByPertanyaanId(1);
      log(`✅ Jawaban for pertanyaan 1: ${Array.isArray(jawaban) ? jawaban.length : (jawaban.data?.length || 0)} answers found`, 'success', jawaban);
    } catch (error) {
      log('❌ Jawaban by pertanyaan error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Set custom token
  const handleSetToken = () => {
    if (customToken.trim()) {
      setGISOfficialToken(customToken.trim());
      setTokenState(customToken.trim());
      log('✅ Custom token set successfully', 'success');
      setCustomToken('');
    } else {
      log('❌ Please enter a valid token', 'error');
    }
  };

  // Clear logs
  const clearLogs = () => {
    setResults([]);
  };

  // Run all tests
  const runAllTests = async () => {
    clearLogs();
    log('🚀 Starting all GIS Official API tests...', 'info');

    await testConnection();
    await testPertanyaan();
    await testJawaban();
    await testFiles();
    await testCompleteData();
    await testBatchOperations();

    log('🎉 All tests completed!', 'success');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🌐 GIS Official API Test Suite
      </h1>

      {/* Token Management */}
      <div style={{
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>🔑 Authentication Token</h3>
        <div style={{ marginBottom: '10px' }}>
          <strong>Current Token:</strong> {token ? '✅ Set' : '❌ Not set'}
          {token && (
            <span style={{ marginLeft: '10px', fontSize: '12px', fontFamily: 'monospace' }}>
              {token.substring(0, 20)}...
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Enter custom token..."
            value={customToken}
            onChange={(e) => setCustomToken(e.target.value)}
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <button
            onClick={handleSetToken}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Set Token
          </button>
        </div>
      </div>

      {/* Test Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <button
          onClick={testConnection}
          disabled={loading}
          style={{
            padding: '12px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          🔌 Test Connection
        </button>

        <button
          onClick={testPertanyaan}
          disabled={loading}
          style={{
            padding: '12px',
            background: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          📝 Test Pertanyaan
        </button>

        <button
          onClick={testJawaban}
          disabled={loading}
          style={{
            padding: '12px',
            background: '#9C27B0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          💡 Test Jawaban
        </button>

        <button
          onClick={testFiles}
          disabled={loading}
          style={{
            padding: '12px',
            background: '#00BCD4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          📁 Test Files
        </button>

        <button
          onClick={testPeserta}
          disabled={loading}
          style={{
            padding: '12px',
            background: '#795548',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          👥 Test Peserta
        </button>

        <button
          onClick={testCompleteData}
          disabled={loading}
          style={{
            padding: '12px',
            background: '#607D8B',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          📊 Complete Data
        </button>

        <button
          onClick={testBatchOperations}
          disabled={loading}
          style={{
            padding: '12px',
            background: '#8BC34A',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          🔄 Batch Operations
        </button>

        <button
          onClick={testPertanyaanWithAnswers}
          disabled={loading}
          style={{
            padding: '12px',
            background: '#E91E63',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          📝 Pertanyaan + Answers
        </button>

        <button
          onClick={testSinglePertanyaan}
          disabled={loading}
          style={{
            padding: '12px',
            background: '#3F51B5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          🔍 Single Pertanyaan
        </button>

        <button
          onClick={testJawabanByPertanyaan}
          disabled={loading}
          style={{
            padding: '12px',
            background: '#009688',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          🔗 Jawaban by Pertanyaan
        </button>

        <button
          onClick={runAllTests}
          disabled={loading}
          style={{
            padding: '12px',
            background: '#F44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            gridColumn: '1 / -1'
          }}
        >
          🚀 Run All Tests
        </button>

        <button
          onClick={clearLogs}
          disabled={loading}
          style={{
            padding: '12px',
            background: '#9E9E9E',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            gridColumn: '1 / -1'
          }}
        >
          🗑️ Clear Logs
        </button>
      </div>

      {/* Results Display */}
      <div style={{
        background: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        maxHeight: '500px',
        overflowY: 'auto'
      }}>
        <h3>📋 Test Results</h3>
        {results.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
            No tests run yet. Click a button above to start testing.
          </p>
        ) : (
          results.map((result, index) => (
            <div
              key={index}
              style={{
                padding: '10px',
                margin: '5px 0',
                borderRadius: '4px',
                background: result.type === 'success' ? '#d4edda' :
                           result.type === 'error' ? '#f8d7da' : '#d1ecf1',
                borderLeft: result.type === 'success' ? '4px solid #28a745' :
                           result.type === 'error' ? '4px solid #dc3545' : '4px solid #17a2b8',
                fontSize: '14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ flex: 1 }}>{result.message}</span>
                <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
                  {result.timestamp}
                </span>
              </div>
              {result.data && (
                <details style={{ marginTop: '5px' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '12px' }}>
                    Show response data
                  </summary>
                  <pre style={{
                    marginTop: '5px',
                    padding: '10px',
                    background: 'white',
                    borderRadius: '4px',
                    fontSize: '11px',
                    overflow: 'auto',
                    maxHeight: '200px'
                  }}>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))
        )}
      </div>

      {/* API Info */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4>ℹ️ API Information</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li><strong>Base URL:</strong> https://api.gisofficial.com/v1/</li>
          <li><strong>Auth:</strong> Bearer Token (JWT)</li>
          <li><strong>Endpoints:</strong> Pertanyaan, Jawaban, Peserta, Files</li>
          <li><strong>Docs:</strong> <a href="https://api.gisofficial.com/swagger" target="_blank">Swagger Documentation</a></li>
        </ul>
      </div>
    </div>
  );
}