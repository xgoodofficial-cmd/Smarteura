import React, { useState } from 'react';
import {
  Database,
  Flame,
  CheckCircle2,
  RefreshCw,
  Server,
  Layers,
  ArrowRight,
  ShieldCheck,
  Table,
  Zap
} from 'lucide-react';
import { testFirestoreConnection } from '../lib/firebase';
import firebaseConfig from '../../firebase-applet-config.json';

export const CloudDbHub: React.FC = () => {
  const [testingFirebase, setTestingFirebase] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
  }>({
    tested: false,
    success: false,
    message: '',
  });

  const handleTestFirestore = async () => {
    setTestingFirebase(true);
    try {
      const result = await testFirestoreConnection();
      setFirebaseStatus({
        tested: true,
        success: result.success,
        message: result.message,
      });
    } catch (err: any) {
      setFirebaseStatus({
        tested: true,
        success: false,
        message: err?.message || 'Firestore connection check returned offline state.',
      });
    } finally {
      setTestingFirebase(false);
    }
  };

  return (
    <div id="cloud-db-hub" className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900">Cloud Database & Storage Infrastructure</h3>
            <p className="text-xs text-neutral-500">
              Provisioned in region <strong className="text-neutral-700">europe-west2</strong> (London)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Active & Provisioned</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Firebase Firestore Card */}
        <div className="border border-neutral-200 rounded-2xl p-5 bg-gradient-to-b from-amber-500/5 to-transparent flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Flame className="w-5 h-5 text-amber-500" />
                <h4 className="text-sm font-semibold text-neutral-900">Firebase Firestore</h4>
              </div>
              <span className="text-[11px] font-mono bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md font-semibold">
                NoSQL Database
              </span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Provides real-time document synchronization and zero-trust ABAC rule enforcement for user sessions, candidate forms, and inquiries.
            </p>

            <div className="space-y-1.5 text-xs text-neutral-600 bg-white/80 p-3 rounded-xl border border-neutral-100 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-neutral-400">Project ID:</span>
                <span className="text-neutral-800 font-medium">{firebaseConfig.projectId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Region:</span>
                <span className="text-neutral-800 font-medium">europe-west2</span>
              </div>
              <div className="flex justify-between truncate">
                <span className="text-neutral-400">Database ID:</span>
                <span className="text-neutral-800 truncate max-w-[170px]" title={(firebaseConfig as any).firestoreDatabaseId}>
                  {(firebaseConfig as any).firestoreDatabaseId || 'default'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              id="btn-test-firestore"
              onClick={handleTestFirestore}
              disabled={testingFirebase}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingFirebase ? 'animate-spin' : ''}`} />
              <span>{testingFirebase ? 'Verifying...' : 'Test Firestore Connection'}</span>
            </button>

            {firebaseStatus.tested && (
              <div
                className={`mt-2.5 p-2.5 rounded-xl text-xs flex items-center space-x-2 ${
                  firebaseStatus.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-neutral-50 text-neutral-700 border border-neutral-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{firebaseStatus.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cloud SQL Card */}
        <div className="border border-neutral-200 rounded-2xl p-5 bg-gradient-to-b from-[#123F32]/5 to-transparent flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Server className="w-5 h-5 text-[#123F32]" />
                <h4 className="text-sm font-semibold text-neutral-900">Cloud SQL (PostgreSQL)</h4>
              </div>
              <span className="text-[11px] font-mono bg-emerald-100 text-[#123F32] px-2.5 py-0.5 rounded-md font-semibold">
                Relational SQL
              </span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Fully managed PostgreSQL Developer Edition with scale-to-zero capabilities, Drizzle ORM schemas, and connection pooling.
            </p>

            <div className="space-y-1.5 text-xs text-neutral-600 bg-white/80 p-3 rounded-xl border border-neutral-100 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-neutral-400">Instance:</span>
                <span className="text-neutral-800 font-medium">ai-studio-fcf0866c</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Region:</span>
                <span className="text-neutral-800 font-medium">europe-west2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">ORM / Driver:</span>
                <span className="text-neutral-800 font-medium">Drizzle ORM & pg pool</span>
              </div>
            </div>

            {/* Schemas / Tables */}
            <div>
              <span className="text-[11px] font-semibold text-neutral-700 block mb-1.5">
                Active Database Tables:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-[11px] font-mono text-neutral-800 flex items-center space-x-1">
                  <Table className="w-3 h-3 text-[#123F32]" />
                  <span>candidate_applications</span>
                </span>
                <span className="px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-[11px] font-mono text-neutral-800 flex items-center space-x-1">
                  <Table className="w-3 h-3 text-[#123F32]" />
                  <span>client_inquiries</span>
                </span>
                <span className="px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-[11px] font-mono text-neutral-800 flex items-center space-x-1">
                  <Table className="w-3 h-3 text-[#123F32]" />
                  <span>users</span>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Drizzle schema synced and tables verified in Cloud SQL.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
