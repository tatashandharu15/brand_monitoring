'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, X, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

const { useState, useEffect } = React;

interface FormData {
  project_name: string;
  keywords: string[];
  language: string;
  location: string;
  sources: string[];
}

export default function WizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    project_name: '',
    keywords: [],
    language: 'en',
    location: 'us',
    sources: []
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [mentionsCount, setMentionsCount] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Auto-redirect to dashboard after step 5 completion
  useEffect(() => {
    console.log('[Wizard] useEffect triggered - currentStep:', currentStep, 'error:', error);
    if (currentStep === 5 && !error) {
      console.log('[Wizard] Setting redirect timer for 3 seconds...');
      const redirectTimer = setTimeout(() => {
        console.log('[Wizard] Redirecting to dashboard...');
        router.push('/dashboard');
      }, 3000);

      return () => {
        console.log('[Wizard] Cleaning up redirect timer');
        clearTimeout(redirectTimer);
      };
    }
  }, [currentStep, error, router]);

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keywordToRemove)
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const toggleSource = (source: string) => {
    setFormData((prev) => {
      const newSources = prev.sources.includes(source)
        ? prev.sources.filter((s) => s !== source)
        : [...prev.sources, source];
      
      console.log('[Wizard] Toggling source:', source);
      console.log('[Wizard] Current sources:', newSources);
      
      return {
        ...prev,
        sources: newSources
      };
    });
  };

  const resetForm = () => {
    setFormData({
      project_name: '',
      keywords: [],
      language: 'en',
      location: 'us',
      sources: []
    });
    setCurrentStep(1);
    setError('');
    setSuccess('');
    setProjectId(null);
    setMentionsCount(0);
    setLoadingProgress(0);
    setLoadingMessage('');
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      setLoadingTimeout(null);
    }
  };

  const simulateProgress = () => {
    let progress = 0;
    const totalDuration = 60000; // 2 minutes in milliseconds
    const intervalTime = 100; // Update every 100ms for smooth animation
    const increment = (100 / totalDuration) * intervalTime;

    const interval = setInterval(() => {
      progress += increment;
      if (progress > 100) progress = 100;
      
      setLoadingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        // Move to step 5 after completion
        console.log('[Wizard] Progress complete, moving to step 5');
        setSuccess('Project setup completed successfully!');
        setCurrentStep(5);
      }
    }, intervalTime);

    setLoadingTimeout(interval);
  };

  const submitProject = async () => {
    console.log('[Wizard] Submit called with formData:', formData);
    
    if (!formData.project_name.trim()) {
      setError('Project name is required');
      return;
    }

    if (formData.keywords.length === 0) {
      setError('At least one keyword is required');
      return;
    }

    if (formData.sources.length === 0) {
      console.log('[Wizard] Sources validation failed. Current sources:', formData.sources);
      setError('At least one platform must be selected');
      return;
    }

    setIsLoading(true);
    setError('');
    setCurrentStep(4);
    simulateProgress();

    try {
      const payload = {
        projectName: formData.project_name,
        keywords: formData.keywords,
        platforms: formData.sources,
        languages: [formData.language],
        countries: [formData.location.toUpperCase()]
      };

      console.log('[Wizard] Submitting project data:', payload);

      const response = await fetch('/api/brandmentions/add-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('[Wizard] API response:', data);

      if (data.success && data.data) {
        setProjectId(data.data.project_id || 'generated-id');
        // Project created successfully, step 4 progress will handle the rest
      } else {
        throw new Error(data.error || 'Failed to create project');
      }
    } catch (err) {
      console.error('[Wizard] Network error:', err);
      setError('Network error occurred. Please ensure the backend server is running.');
      setCurrentStep(1);
    } finally {
      setIsLoading(false);
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        setLoadingTimeout(null);
      }
    }
  };

  const sources = [
    { 
      id: 'web', 
      name: 'Web', 
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
        </svg>
      )
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>
        </svg>
      )
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
        </svg>
      )
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="url(#instagram-gradient)"/>
          <defs>
            <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#833AB4"/>
              <stop offset="50%" stopColor="#FD1D1D"/>
              <stop offset="100%" stopColor="#FCB045"/>
            </linearGradient>
          </defs>
        </svg>
      )
    },
    { 
      id: 'youtube', 
      name: 'YouTube', 
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000"/>
        </svg>
      )
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/>
        </svg>
      )
    },
    { 
      id: 'reddit', 
      name: 'Reddit', 
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" fill="#FF4500"/>
        </svg>
      )
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="currentColor"/>
        </svg>
      )
    },
    { 
      id: 'pinterest', 
      name: 'Pinterest', 
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.482-1.995.699 0 1.037.219 1.037 1.178 0 .718-.219 1.797-.359 2.797-.199.937.478 1.678 1.478 1.678 1.797 0 3.173-1.897 3.173-4.634 0-2.424-1.738-4.122-4.214-4.122-2.873 0-4.573 2.155-4.573 4.383 0 .867.332 1.797.747 2.305a.337.337 0 0 1 .078.323c-.083.344-.269 1.1-.305 1.257-.047.196-.156.237-.359.143-1.344-.627-2.185-2.583-2.185-4.175 0-3.188 2.317-6.12 6.686-6.12 3.512 0 6.239 2.501 6.239 5.845 0 3.488-2.2 6.291-5.25 6.291-1.026 0-1.991-.534-2.317-1.24 0 0-.508 1.934-.632 2.401-.229.867-.85 1.95-1.264 2.611.951.293 1.95.449 2.966.449 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.017 0z" fill="#E60023"/>
        </svg>
      )
    },
    { 
      id: 'tumblr', 
      name: 'Tumblr', 
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.016 1.001.375 2.371 2.207 2.371h.09c.631-.02 1.486-.205 1.936-.419l1.156 3.425c-.436.636-2.4 1.374-4.156 1.404h-.178l.011.002z" fill="#001935"/>
        </svg>
      )
    },
    { 
      id: 'flickr', 
      name: 'Flickr', 
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12c0 2.05.33 4.06.94 5.94A12.001 12.001 0 0 1 12 0C5.373 0 0 5.373 0 12zm24 0c0-6.627-5.373-12-12-12 2.05 0 4.06.33 5.94.94A12.001 12.001 0 0 1 24 12z" fill="#0063DC"/>
          <circle cx="5.5" cy="12" r="3" fill="#FF0084"/>
          <circle cx="18.5" cy="12" r="3" fill="#FF0084"/>
        </svg>
      )
    },
    { 
      id: 'vk', 
      name: 'VK', 
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-.9-1.49.402v1.15c0 .308-.099.495-.825.495-1.943 0-4.102-1.172-5.617-3.358-2.267-3.146-2.898-5.511-2.898-5.997 0-.33.132-.495.429-.495h1.744c.33 0 .456.132.583.495.66 1.947 1.776 3.647 2.233 2.348.363-1.03.066-3.311-.429-3.729-.33-.264.099-.825 1.129-.825h2.744c.33 0 .33.198.33.495v4.597c0 .33.148.396.247.396.33 0 .66-.264 1.129-.825 1.452-1.776 2.497-4.51 2.497-4.51.099-.198.297-.396.693-.396h1.744c.462 0 .561.231.462.495-.198.66-2.1 4.082-2.1 4.082-.198.33-.099.495 0 .66.198.33 1.353 1.776 1.353 1.776.33.462.066.825-.264.825z" fill="#4C75A3"/>
        </svg>
      )
    },
    { 
      id: 'weibo', 
      name: 'Weibo', 
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zm8.717-8.922c-.332-.066-.562-.132-.389-.475.375-.751.413-1.402.111-1.87-.564-.874-2.111-.83-4.11-.067 0 0-.628.246-.467-.2.308-0.889.26-1.63-.154-2.056-.931-.96-3.406.037-5.527 2.23-1.595 1.646-2.522 3.408-2.522 4.944 0 2.914 3.653 4.69 7.214 4.69 4.683 0 7.796-2.717 7.796-4.876 0-1.297-1.088-2.03-1.952-2.22zm2.927-5.8c-1.128-1.281-2.794-1.768-4.1-1.218l-.17.076c-.293.135-.46.459-.37.724.09.265.37.39.63.281l.154-.068c.928-.416 2.117-.12 2.93.74.812.86 1.024 2.08.5 3.052-.09.168-.135.36-.045.54.09.18.27.27.45.27.18 0 .36-.09.45-.27.735-1.365.465-3.14-.629-4.427zm1.633-1.617C20.9 1.59 18.6.68 16.607 1.308c-.45.135-.72.6-.585 1.05.135.45.6.72 1.05.585 1.41-.45 3.015.18 4.05 1.59 1.035 1.41 1.215 3.285.45 4.725-.18.36-.045.81.315.99.36.18.81.045.99-.315 1.08-2.025.855-4.65-.72-6.427z" fill="#E6162D"/>
        </svg>
      )
    },
    { 
      id: 'telegram', 
      name: 'Telegram', 
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" fill="#26A5E4"/>
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Brand Monitoring Setup Wizard
          </h1>
          <p className="text-lg text-gray-600">
            Set up your brand monitoring project in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center items-center space-x-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    currentStep >= step
                      ? currentStep > step
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 5 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-200 ${
                      currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Step 1: Project Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl">Step 1: Project Information</CardTitle>
                  <CardDescription>
                    Enter your project name and keywords to monitor
                  </CardDescription>
                </CardHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project-name" className="text-base font-medium">
                      Project Name
                    </Label>
                    <Input
                      id="project-name"
                      type="text"
                      value={formData.project_name}
                      onChange={(e) => setFormData((prev) => ({
                        ...prev,
                        project_name: e.target.value
                      }))}
                      placeholder="Enter project name"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="keyword-input" className="text-base font-medium">
                      Keywords
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="keyword-input"
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        placeholder="Enter a keyword"
                        onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                      />
                      <Button onClick={addKeyword} type="button">
                        Add
                      </Button>
                    </div>
                  </div>

                  {formData.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.keywords.map((keyword) => (
                        <Badge
                          key={keyword}
                          variant="secondary"
                          className="px-3 py-1 text-sm flex items-center gap-2"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(keyword)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={nextStep}
                    disabled={!formData.project_name.trim() || formData.keywords.length === 0}
                    className="flex items-center gap-2"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Language & Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl">Step 2: Language & Location Settings</CardTitle>
                  <CardDescription>
                    Configure language and location preferences
                  </CardDescription>
                </CardHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="language-select" className="text-base font-medium">
                      Language
                    </Label>
                    <select
                      id="language-select"
                      value={formData.language}
                      onChange={(e) => setFormData((prev) => ({
                        ...prev,
                        language: e.target.value
                      }))}
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="All">All Languages</option>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="pt">Portuguese</option>
                      <option value="ru">Russian</option>
                      <option value="ja">Japanese</option>
                      <option value="ko">Korean</option>
                      <option value="zh">Chinese</option>
                      <option value="ar">Arabic</option>
                      <option value="hi">Hindi</option>
                      <option value="tr">Turkish</option>
                      <option value="pl">Polish</option>
                      <option value="nl">Dutch</option>
                      <option value="sv">Swedish</option>
                      <option value="da">Danish</option>
                      <option value="no">Norwegian</option>
                      <option value="fi">Finnish</option>
                      <option value="el">Greek</option>
                      <option value="id">Indonesian</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="location-select" className="text-base font-medium">
                      Location
                    </Label>
                    <select
                      id="location-select"
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({
                        ...prev,
                        location: e.target.value
                      }))}
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="All">All Locations</option>
                      <option value="us">United States</option>
                      <option value="gb">United Kingdom</option>
                      <option value="ca">Canada</option>
                      <option value="au">Australia</option>
                      <option value="de">Germany</option>
                      <option value="fr">France</option>
                      <option value="es">Spain</option>
                      <option value="it">Italy</option>
                      <option value="br">Brazil</option>
                      <option value="mx">Mexico</option>
                      <option value="jp">Japan</option>
                      <option value="kr">South Korea</option>
                      <option value="cn">China</option>
                      <option value="in">India</option>
                      <option value="ru">Russia</option>
                      <option value="tr">Turkey</option>
                      <option value="pl">Poland</option>
                      <option value="nl">Netherlands</option>
                      <option value="se">Sweden</option>
                      <option value="id">Indonesia</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={prevStep} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button onClick={nextStep} className="flex items-center gap-2">
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Sources */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl">Step 3: Sources to Monitor</CardTitle>
                  <CardDescription>
                    Select the sources you want to monitor for mentions
                  </CardDescription>
                </CardHeader>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {sources.map((source) => (
                    <div
                      key={source.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        formData.sources.includes(source.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleSource(source.id)}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">{source.logo}</div>
                        <div className="font-medium text-sm">{source.name}</div>
                        {formData.sources.includes(source.id) && (
                          <CheckCircle className="w-5 h-5 text-blue-500 mx-auto mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={prevStep} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={submitProject}
                    disabled={formData.sources.length === 0}
                    className="flex items-center gap-2"
                  >
                    Create Project ({formData.sources.length} platforms selected)
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Debug info */}
                <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
                  <strong>Debug:</strong> Selected platforms: {JSON.stringify(formData.sources)}
                </div>
              </div>
            )}

            {/* Step 4: Loading */}
            {currentStep === 4 && (
              <div className="space-y-6 text-center">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl">Setting Up Your Project</CardTitle>
                  <CardDescription>
                    Please wait while we configure your monitoring project...
                  </CardDescription>
                </CardHeader>

                <div className="space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-500" />
                  <Progress value={loadingProgress} className="w-full" />
                  <div className="text-lg font-medium">{Math.round(loadingProgress)}%</div>
                </div>
              </div>
            )}

            {/* Step 5: Success/Error */}
            {currentStep === 5 && (
              <div className="space-y-6 text-center">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl">
                    {error ? 'Setup Failed' : 'Project Created Successfully!'}
                  </CardTitle>
                  <CardDescription>
                    {error ? 'There was an error setting up your project' : 'Your monitoring project is now active'}
                  </CardDescription>
                </CardHeader>

                <div className="space-y-6">
                  {error ? (
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <X className="w-8 h-8 text-red-500" />
                    </div>
                  ) : (
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  )}
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800">{error}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert className="mt-4 border-red-200 bg-red-50">
            <AlertDescription className="flex items-center justify-between">
              <span><strong>Error:</strong> {error}</span>
              <button
                onClick={() => setError('')}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert className="mt-4 border-green-200 bg-green-50">
            <AlertDescription className="flex items-center justify-between">
              <span><strong>Success:</strong> {success}</span>
              <button
                onClick={() => setSuccess('')}
                className="text-green-500 hover:text-green-700"
              >
                <X className="w-4 h-4" />
              </button>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}