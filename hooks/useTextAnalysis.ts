import { useState } from "react";
import { fastapiAPI } from "~/services/api";

export function useTextAnalysis() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeText = async (input: string) => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const res = await fastapiAPI.analyzeText(input);
      setResult(res);
      console.log("Analyze result:", res);
    } catch (err: any) {
      setError(err.message || "Failed to process input.");
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return {
    result,
    loading,
    error,
    analyzeText,
    clearResult,
  };
} 