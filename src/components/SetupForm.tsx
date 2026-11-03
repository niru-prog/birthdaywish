import React, { useState, useRef } from 'react';
import { BirthdaySurpriseData, ThemeColor } from '../types';
import { THEMES } from '../utils/themes';
import { Sparkles, Calendar, Heart, Gift, Upload, X, ArrowRight, User, RotateCcw } from 'lucide-react';

interface SetupFormProps {
  initialData?: BirthdaySurpriseData | null;
  onSubmit: (data: BirthdaySurpriseData) => void;
  onCancel?: () => void;
}

export function SetupForm({ initialData, onSubmit, onCancel }: SetupFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [age, setAge] = useState<number | string>(initialData?.age || 18);
  const [message, setMessage] = useState(
    initialData?.message ||
      'May your year ahead be filled with as much laughter, adventures, and late-night study snacks as you bring to everyone around you! You inspire me every day. Happy Birthday bestie! 🎂✨'
  );
  const [birthDate, setBirthDate] = useState(
    initialData?.birthDate ||
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0]
  );
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(initialData?.photoUrl);
  const [theme, setTheme] = useState<ThemeColor>(initialData?.theme || 'pink');
  const [creatorName, setCreatorName] = useState(initialData?.creatorName || '');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress & read image to base64
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setPhotoUploading(true);
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Downscale to max 800x800 for optimal localStorage footprint
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          setPhotoUrl(compressed);
        } else {
          setPhotoUrl(event.target?.result as string);
        }
        setPhotoUploading(false);
      };
      img.onerror = () => {
        setErrorMessage('Failed to process image. Please try another one.');
        setPhotoUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = () => {
    setName('Sophia');
    setAge(20);
    setMessage(
      'To my favorite partner-in-crime: another year of inside jokes, unforgettable memories, and conquering our dreams together! Hope your day is as sweet and radiant as you are. 💖🎉'
    );
    setBirthDate(new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0]);
    setTheme('pink');
    setCreatorName('Alex');
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage("Please enter your friend's name.");
      return;
    }

    const parsedAge = parseInt(String(age), 10);
    if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 120) {
      setErrorMessage('Please enter a valid age between 1 and 120.');
      return;
    }

    if (!birthDate) {
      setErrorMessage('Please pick their birthday date.');
      return;
    }

    if (!message.trim()) {
      setErrorMessage('Please write a short personal message.');
      return;
    }

    onSubmit({
      name: name.trim(),
      age: parsedAge,
      message: message.trim(),
      birthDate,
      photoUrl,
      theme,
      creatorName: creatorName.trim() || undefined,
    });
  };

  const themeOptions: ThemeColor[] = ['pink', 'purple', 'blue', 'gold'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50/50 to-amber-50/40 py-10 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-10 relative overflow-hidden">
        {/* Decorative corner sparkles */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-pink-200/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-purple-200/50 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Gift className="w-3.5 h-3.5" />
            <span>Personalized Birthday Surprise</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Create Birthday Magic ✨
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-md mx-auto">
            Design a custom, interactive celebration page to share with your friend. Complete with animated envelope, blowing candles, and tunes!
          </p>

          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium inline-flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-rose-50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Fill with sample details
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <span className="font-semibold">Notice:</span> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          {/* Friend Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Friend's Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sophia, Alex, Marcus..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-slate-50/50 text-slate-900 font-medium transition"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Turning Age <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="18"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-slate-50/50 text-slate-900 font-medium transition"
              />
            </div>
          </div>

          {/* Birthday Date & Creator's Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Birthday Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-slate-50/50 text-slate-900 font-medium transition"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Name <span className="text-slate-400 font-normal">(Sender / Creator)</span>
              </label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="e.g. Maya, Jordan"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-slate-50/50 text-slate-900 font-medium transition"
              />
            </div>
          </div>

          {/* Short Personal Message */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Personal Message <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400">Handwritten card style</span>
            </div>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a sweet, funny or inspiring birthday message..."
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-slate-50/50 text-slate-900 font-normal transition resize-none leading-relaxed"
            />
          </div>

          {/* Optional Photo Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Friend's Photo <span className="text-slate-400 font-normal">(Optional Polaroid frame)</span>
            </label>

            {!photoUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-rose-400 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-rose-50/20 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="w-10 h-10 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-rose-500 mb-2 transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-slate-700 group-hover:text-rose-600 transition-colors">
                  {photoUploading ? 'Processing photo...' : 'Click or tap to upload a photo'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, or WEBP from your phone or laptop</p>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <img
                  src={photoUrl}
                  alt="Uploaded preview"
                  className="w-16 h-16 rounded-xl object-cover shadow-sm border border-white"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">Photo attached</p>
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-emerald-600" /> Ready for Polaroid frame
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Theme Color Choice (Pink, Purple, Blue, Gold) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Theme Colour Choice <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {themeOptions.map((opt) => {
                const conf = THEMES[opt];
                const isSelected = theme === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTheme(opt)}
                    className={`relative p-3 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-white shadow-md scale-[1.02]'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-5 h-5 rounded-full shadow-inner border border-white"
                        style={{ backgroundColor: conf.accentHex }}
                      />
                      <span className="text-xs font-bold text-slate-900">{conf.badgeLabel}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{conf.name}</p>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-900" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-base shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Create Birthday Surprise</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto py-4 px-6 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-sm transition"
              >
                Back to Surprise
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
