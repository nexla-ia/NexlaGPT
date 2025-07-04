import { useState, useCallback } from 'react';

interface N8NConfig {
  baseUrl: string;
  apiKey: string;
  webhookUrl: string;
}

interface N8NWorkflow {
  id: string;
  name: string;
  active: boolean;
  tags: string[];
}

export function useN8NIntegration() {
  const [config, setConfig] = useState<N8NConfig | null>(null);
  const [workflows, setWorkflows] = useState<N8NWorkflow[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const connectToN8N = useCallback(async (newConfig: N8NConfig) => {
    setIsLoading(true);
    try {
      // Simulate API connection - replace with actual N8N API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConfig(newConfig);
      setIsConnected(true);
      
      // Mock workflows data
      setWorkflows([
        { id: '1', name: 'Chat Response Handler', active: true, tags: ['chat', 'ai'] },
        { id: '2', name: 'Data Processing Pipeline', active: false, tags: ['data', 'processing'] },
        { id: '3', name: 'Notification System', active: true, tags: ['notifications', 'alerts'] }
      ]);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to connect to N8N:', error);
      return { success: false, error: 'Connection failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendToN8N = useCallback(async (workflowId: string, data: any) => {
    if (!config || !isConnected) {
      throw new Error('N8N not connected');
    }

    try {
      // Simulate sending data to N8N workflow
      const response = await fetch(`${config.baseUrl}/webhook/${workflowId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to send data to N8N');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending to N8N:', error);
      throw error;
    }
  }, [config, isConnected]);

  const triggerWorkflow = useCallback(async (workflowId: string, inputData: any) => {
    if (!config || !isConnected) {
      return { success: false, error: 'N8N not connected' };
    }

    try {
      setIsLoading(true);
      
      // Simulate workflow trigger
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = await sendToN8N(workflowId, inputData);
      
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setIsLoading(false);
    }
  }, [config, isConnected, sendToN8N]);

  const disconnect = useCallback(() => {
    setConfig(null);
    setIsConnected(false);
    setWorkflows([]);
  }, []);

  return {
    config,
    workflows,
    isConnected,
    isLoading,
    connectToN8N,
    sendToN8N,
    triggerWorkflow,
    disconnect
  };
}