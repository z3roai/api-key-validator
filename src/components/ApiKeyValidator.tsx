"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";

interface ModelResult {
  model: string;
  status: 'success' | 'error' | 'testing';
  response?: string;
  error?: string;
  responseTime?: number;
}

interface AvailableModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

export function ApiKeyValidator() {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [availableModels, setAvailableModels] = useState<AvailableModel[]>([]);
  const [results, setResults] = useState<ModelResult[]>([]);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const fetchAvailableModels = async () => {
    if (!apiKey.trim()) {
      alert("Please enter an API key");
      return;
    }

    setIsFetchingModels(true);
    setAvailableModels([]);

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableModels(data.data || []);
      } else {
        const errorData = await response.json();
        alert(`Failed to fetch models: ${errorData.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`Error fetching models: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsFetchingModels(false);
    }
  };

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      alert("Please enter an API key");
      return;
    }

    // First fetch available models if not already fetched
    if (availableModels.length === 0) {
      await fetchAvailableModels();
      if (availableModels.length === 0) {
        return;
      }
    }

    setIsValidating(true);
    setResults([]);
    setOverallStatus('idle');

    const testResults: ModelResult[] = [];
    const modelsToTest = availableModels.length > 0 ? availableModels : [
      { id: 'gpt-4o' },
      { id: 'gpt-4o-mini' },
      { id: 'gpt-4-turbo' },
      { id: 'gpt-4' },
      { id: 'gpt-3.5-turbo' },
      { id: 'gpt-3.5-turbo-16k' },
      { id: 'text-davinci-003' },
      { id: 'text-davinci-002' },
      { id: 'text-curie-001' },
      { id: 'text-babbage-001' },
      { id: 'text-ada-001' }
    ];

    for (const model of modelsToTest) {
      const startTime = Date.now();
      
      // Set current model as testing
      testResults.push({
        model: model.id,
        status: 'testing'
      });
      setResults([...testResults]);

      try {
        // Try chat completions first (for newer models)
        let response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model.id,
            messages: [
              {
                role: 'user',
                content: 'Write a single-line friendly hello message.'
              }
            ],
            max_tokens: 50,
            temperature: 0.7
          })
        });

        // If chat completions fails, try completions (for older models)
        if (!response.ok && response.status === 404) {
          response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: model.id,
              prompt: 'Write a single-line friendly hello message.',
              max_tokens: 50,
              temperature: 0.7
            })
          });
        }

        const responseTime = Date.now() - startTime;
        const data = await response.json();

        if (response.ok) {
          // Handle both chat completions and completions responses
          let responseText = '';
          if (data.choices?.[0]?.message?.content) {
            responseText = data.choices[0].message.content;
          } else if (data.choices?.[0]?.text) {
            responseText = data.choices[0].text;
          } else {
            responseText = 'No response content';
          }

          testResults[testResults.length - 1] = {
            model: model.id,
            status: 'success',
            response: responseText,
            responseTime
          };
        } else {
          testResults[testResults.length - 1] = {
            model: model.id,
            status: 'error',
            error: data.error?.message || `HTTP ${response.status}`,
            responseTime
          };
        }
      } catch (error) {
        const responseTime = Date.now() - startTime;
        testResults[testResults.length - 1] = {
          model: model.id,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime
        };
      }

      setResults([...testResults]);
    }

    setIsValidating(false);
    
    // Determine overall status
    const hasSuccess = testResults.some(result => result.status === 'success');
    setOverallStatus(hasSuccess ? 'success' : 'error');
  };

  const getStatusIcon = (status: ModelResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'testing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: ModelResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'testing':
        return <Badge variant="secondary">Testing...</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            OpenAI API Key Validation
          </CardTitle>
          <CardDescription>
            Enter your OpenAI API key to test it against all available models
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="password"
              placeholder="Enter your OpenAI API key (sk-...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
              disabled={isValidating || isFetchingModels}
            />
            <Button 
              onClick={fetchAvailableModels} 
              disabled={isFetchingModels || !apiKey.trim()}
              variant="outline"
              className="min-w-[140px]"
            >
              {isFetchingModels ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                'Get Models'
              )}
            </Button>
            <Button 
              onClick={validateApiKey} 
              disabled={isValidating || !apiKey.trim()}
              className="min-w-[120px]"
            >
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test All Models'
              )}
            </Button>
          </div>

          {availableModels.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                <strong>Found {availableModels.length} available models:</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {availableModels.slice(0, 10).map((model, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {model.id}
                  </Badge>
                ))}
                {availableModels.length > 10 && (
                  <Badge variant="outline" className="text-xs">
                    +{availableModels.length - 10} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {overallStatus !== 'idle' && (
            <Alert className={overallStatus === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {overallStatus === 'success' 
                  ? 'API key validation completed successfully!' 
                  : 'API key validation failed. Please check your key and try again.'
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Results</CardTitle>
            <CardDescription>
              Testing results for all OpenAI models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <span className="font-medium">{result.model}</span>
                        {availableModels.length > 0 && (
                          <div className="text-xs text-gray-500">
                            {availableModels.find(m => m.id === result.model)?.owned_by || 'Unknown'}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(result.status)}
                      {result.responseTime && (
                        <Badge variant="outline">
                          {result.responseTime}ms
                        </Badge>
                      )}
                    </div>
                  </div>

                  {result.status === 'success' && result.response && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Response:</strong> {result.response}
                      </p>
                    </div>
                  )}

                  {result.status === 'error' && result.error && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                      <p className="text-sm text-red-800 dark:text-red-200">
                        <strong>Error:</strong> {result.error}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
