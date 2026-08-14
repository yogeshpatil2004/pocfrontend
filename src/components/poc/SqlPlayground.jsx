import React, { useState } from 'react';
import { Play, Terminal, CheckCircle2, Clock, Cpu, Code2, Database } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { executeTextToSql } from '../../api/playgroundApi';

export const SqlPlayground = () => {
  const sampleQueries = [
    "Show top 5 customers by total order spending over the past 30 days",
    "List all medical records where diagnosis status is marked pending",
    "Compute average API query latency grouped by model version",
    "Find users with failed authentication attempts in the last 24 hours"
  ];

  const [inputQuery, setInputQuery] = useState(sampleQueries[0]);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState({
    query: sampleQueries[0],
    generatedSql: `SELECT customer_id, name, SUM(order_total) AS total_spent\nFROM customers\nJOIN orders ON customers.id = orders.customer_id\nWHERE orders.created_at >= NOW() - INTERVAL '30 days'\nGROUP BY customer_id, name\nORDER BY total_spent DESC\nLIMIT 5;`,
    executionTimeMs: 142,
    tokensUsed: 384,
    confidenceScore: "99.4%",
    schemaMatched: "e_commerce_db.customers",
    results: [
      { customer_id: "CUST-8092", name: "Aria Sterling", total_spent: "$14,850.00" },
      { customer_id: "CUST-4410", name: "Vibodh Tech Labs", total_spent: "$12,400.00" },
      { customer_id: "CUST-9122", name: "Kiran Patel", total_spent: "$9,750.50" },
      { customer_id: "CUST-1038", name: "Apex Data Systems", total_spent: "$8,320.00" },
      { customer_id: "CUST-7721", name: "Helios Analytics", total_spent: "$7,600.00" }
    ]
  });

  const handleRunQuery = async () => {
    if (!inputQuery.trim()) return;
    setExecuting(true);
    const data = await executeTextToSql(inputQuery);
    setResult(data);
    setExecuting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Left Column: Natural Query Input */}
      <div className="lg:col-span-5 space-y-6">
        <GlassCard hoverEffect={false} className="border-primary-200">
          <div className="flex items-center gap-2 mb-4 text-primary-600 font-mono text-xs uppercase tracking-wider">
            <Terminal className="w-4 h-4" />
            <span>Interactive Natural Language Prompt</span>
          </div>

          <textarea
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            rows={4}
            placeholder="Type your plain English database query..."
            className="w-full bg-white border border-slate-200 rounded p-4 font-sans text-sm text-slate-900 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-500 transition-all"
          />

          <div className="mt-4 flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-500">Target Schema: PostgreSQL</span>
            <Button
              onClick={handleRunQuery}
              disabled={executing}
              icon={Play}
              size="md"
            >
              {executing ? 'Translating SQL...' : 'Run Query Agent'}
            </Button>
          </div>
        </GlassCard>

        {/* Sample Prompts Preset */}
        <div className="space-y-3">
          <div className="font-mono text-xs text-slate-500 uppercase">Preset Sample Prompts</div>
          <div className="space-y-2">
            {sampleQueries.map((query, idx) => (
              <button
                key={idx}
                onClick={() => setInputQuery(query)}
                className="w-full text-left p-3 rounded bg-white hover:bg-slate-100 border border-slate-100 hover:border-primary-300 font-sans text-xs text-slate-700 transition-all flex items-center justify-between"
              >
                <span>"{query}"</span>
                <Code2 className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Dynamic SQL & Table Output */}
      <div className="lg:col-span-7 space-y-6">
        <GlassCard hoverEffect={false} className="bg-white border-slate-200">
          
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-2 text-slate-900 font-mono text-xs">
              <Database className="w-4 h-4 text-primary-600" />
              <span>Generated SQL Output</span>
            </div>
            <div className="flex items-center gap-4 font-mono text-xs text-slate-500">
              <span className="flex items-center gap-1 text-primary-500">
                <Clock className="w-3.5 h-3.5 text-primary-600" /> {result.executionTimeMs}ms
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-blue-400" /> {result.tokensUsed} tokens
              </span>
              <span className="text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded">
                Confidence: {result.confidenceScore}
              </span>
            </div>
          </div>

          {/* SQL Code Box */}
          <div className="py-4">
            <pre className="font-mono text-xs text-amber-300 bg-slate-50 p-4 rounded border border-slate-100 overflow-x-auto leading-relaxed">
              <code>{result.generatedSql}</code>
            </pre>
          </div>

          {/* Execution Result Table */}
          <div className="pt-2">
            <div className="font-mono text-xs text-slate-500 mb-3 flex items-center justify-between">
              <span>Execution Results ({result.results.length} rows returned)</span>
              <span className="text-emerald-400 text-[11px]">✓ Verified Schema Alignment</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-white text-slate-500 border-b border-slate-200">
                  <tr>
                    {Object.keys(result.results[0] || {}).map((col, idx) => (
                      <th key={idx} className="px-4 py-2.5 uppercase tracking-wider">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-700">
                  {result.results.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="px-4 py-2.5">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </GlassCard>
      </div>

    </div>
  );
};
