import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Brain, CheckCircle2, AlertCircle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { verifyEmail } from '../services/authService.js';
import { useToast } from '../context/ToastContext.jsx';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const toast = useToast();
  const navigate = useNavigate();

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing from the URL.');
      return;
    }

    const performVerification = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email successfully verified! You can now log in.');
        toast.success('Email verified successfully!');
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.message ||
          'Verification failed or token has expired. Please try registering or requesting a new link.'
        );
      }
    };

    performVerification();
  }, [token, toast]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center p-0.5 shadow-xl shadow-indigo-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">Hire<span className="text-indigo-400">AI</span></span>
          </Link>
        </div>

        {/* Status Card */}
        <div className="glass-panel rounded-2xl p-8 border border-slate-800 text-center space-y-5 shadow-2xl">
          
          {status === 'verifying' && (
            <div className="space-y-4 py-6">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin mx-auto" />
              <h2 className="text-lg font-bold text-white">Verifying your email...</h2>
              <p className="text-xs text-slate-400">Connecting with HireAI authentication services</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/15">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Account Activated!</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{message}</p>
              <div className="pt-3">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md transition"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-lg shadow-rose-500/15">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Verification Failed</h2>
              <p className="text-xs text-rose-300 leading-relaxed">{message}</p>
              <div className="pt-3 flex flex-col gap-2">
                <Link
                  to="/register"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition text-center"
                >
                  Create a New Account
                </Link>
                <Link
                  to="/login"
                  className="text-xs text-slate-400 hover:text-white transition py-1"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default VerifyEmail;
