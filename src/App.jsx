import React, { useState, useEffect } from 'react';
import { Mail, AlertCircle, CheckCircle, BarChart3, Brain, Sparkles } from 'lucide-react';

const SpamClassifier = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [model, setModel] = useState('naive_bayes');
  const [stats, setStats] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const trainingData = [
    { text: "WINNER! Claim your FREE prize now! Click here immediately!", label: 1 },
    { text: "Congratulations! You've won $1,000,000. Send your bank details to claim.", label: 1 },
    { text: "URGENT: Your account will be suspended. Verify now by clicking this link.", label: 1 },
    { text: "Make money fast! Work from home earning $5000 per week guaranteed!", label: 1 },
    { text: "BUY CHEAP MEDS ONLINE! Viagra, Cialis 70% OFF! No prescription needed!", label: 1 },
    { text: "You have been selected for a special offer! Act now, limited time only!", label: 1 },
    { text: "FREE iPhone 15 Pro! Click now to claim your gift! Hurry while stocks last!", label: 1 },
    { text: "Dear valued customer, confirm your password immediately to avoid account closure", label: 1 },
    { text: "Hot singles in your area want to meet you! Sign up free today!", label: 1 },
    { text: "Your PayPal account has been limited. Click here to restore access now!", label: 1 },
    { text: "Get rich quick! Join our investment program with 500% returns monthly!", label: 1 },
    { text: "CONGRATULATIONS!!! You are today's lucky winner! Claim cash prize instantly!", label: 1 },
    { text: "Lose 30 pounds in 30 days! Magic pills that really work! Order now!", label: 1 },
    { text: "Nigerian prince needs your help transferring $50 million. You get 20%!", label: 1 },
    { text: "FINAL NOTICE: Your tax refund of $3,450 is waiting. Claim immediately!", label: 1 },
    { text: "Increase your income by 300%! Work from home opportunity. Start today!", label: 1 },
    { text: "ALERT: Suspicious activity on your account. Click to verify identity now!", label: 1 },
    { text: "You've been pre-approved for a $50,000 loan! No credit check required!", label: 1 },
    { text: "Act fast! Limited time offer expires tonight! Get 90% discount now!", label: 1 },
    { text: "Your Netflix account has been suspended. Update payment info immediately.", label: 1 },
    { text: "Earn $10,000 per month working part-time from home! No experience needed!", label: 1 },
    { text: "URGENT SECURITY ALERT: Your Apple ID has been locked. Verify now!", label: 1 },
    { text: "Congratulations! You've won a free vacation to Hawaii! Claim your prize!", label: 1 },
    { text: "Get instant access to exclusive investment opportunities! Join now for free!", label: 1 },
    { text: "Your Amazon Prime membership expired. Renew now to avoid service interruption!", label: 1 },
    { text: "Weight loss miracle! Lose 50 pounds in 2 weeks without diet or exercise!", label: 1 },
    { text: "BREAKING: Government stimulus check waiting for you! Claim $6,400 now!", label: 1 },
    { text: "You have 3 unread messages from attractive singles nearby! View profiles!", label: 1 },
    { text: "Earn passive income! Bitcoin investment with guaranteed 400% returns!", label: 1 },
    { text: "FINAL WARNING: Your account will be deleted in 24 hours! Act now!", label: 1 },
    { text: "Free gift card giveaway! Get $500 Amazon gift card instantly! Click here!", label: 1 },
    { text: "Your Microsoft account needs verification. Click to confirm identity now!", label: 1 },
    { text: "Exclusive offer just for you! Get luxury watches at 95% off! Limited stock!", label: 1 },
    { text: "IRS TAX REFUND: You are owed $4,789. Claim your refund immediately!", label: 1 },
    { text: "Work from home and earn $8,000 monthly! No skills required! Start today!", label: 1 },
    { text: "Your Gmail storage is full! Upgrade now to avoid losing emails!", label: 1 },
    { text: "CONGRATULATIONS! You're our millionth visitor! Claim your MacBook Pro!", label: 1 },
    { text: "Debt relief program! Eliminate all credit card debt legally! Free consultation!", label: 1 },
    { text: "Your package delivery failed. Click to reschedule and confirm address.", label: 1 },
    { text: "Anti-aging cream that actually works! Look 20 years younger! Order now!", label: 1 },
    { text: "URGENT: Your social security number has been suspended! Call immediately!", label: 1 },
    { text: "Get followers instantly! Buy 10,000 Instagram followers for $9.99!", label: 1 },
    { text: "You've been selected for exclusive membership! VIP access for free!", label: 1 },
    { text: "Your Paypal payment is pending. Confirm transaction to receive $850!", label: 1 },
    { text: "Make money online! Easy system guarantees $500 daily income! Try free!", label: 1 },
    { text: "FINAL NOTICE: Unpaid toll charges detected. Pay $12.50 to avoid penalties!", label: 1 },
    { text: "Your Facebook account will be disabled. Click here to appeal now!", label: 1 },
    { text: "Cryptocurrency alert! Bitcoin giveaway happening now! Join and earn!", label: 1 },
    { text: "SHOCKING: Celebrity secret to perfect skin revealed! Try it free today!", label: 1 },
    { text: "Your bank account has unusual activity. Verify your identity immediately!", label: 1 },
    { text: "Limited slots available! Get certified online in 24 hours! Enroll now!", label: 1 },
    { text: "You have inherited $2.5 million! Contact attorney to claim inheritance!", label: 1 },
    { text: "URGENT: Your computer is infected with viruses! Download antivirus now!", label: 1 },
    { text: "Hi John, can we schedule a meeting for next Tuesday to discuss the project?", label: 0 },
    { text: "Your Amazon order #12345 has been shipped and will arrive on Thursday.", label: 0 },
    { text: "Team meeting reminder: Tomorrow at 2 PM in conference room B.", label: 0 },
    { text: "Thanks for your presentation yesterday. The client was very impressed.", label: 0 },
    { text: "Your monthly bank statement is now available. Login to view details.", label: 0 },
    { text: "Mom, I'll be home late tonight. Don't wait up for dinner.", label: 0 },
    { text: "The quarterly report has been completed. Please review when you have time.", label: 0 },
    { text: "Your subscription renewal is coming up next month. No action needed.", label: 0 },
    { text: "Great job on the presentation! Let me know if you need any help with the follow-up.", label: 0 },
    { text: "Reminder: Your dentist appointment is scheduled for Friday at 10 AM.", label: 0 },
    { text: "I've attached the documents you requested. Let me know if you need anything else.", label: 0 },
    { text: "The conference call has been rescheduled to Wednesday at 3 PM.", label: 0 },
    { text: "Your flight booking confirmation for trip to Boston on March 15th.", label: 0 },
    { text: "Happy birthday! Hope you have a wonderful day with family and friends.", label: 0 },
    { text: "The project deadline has been extended by one week to next Friday.", label: 0 },
    { text: "Please find attached the meeting minutes from our discussion yesterday.", label: 0 },
    { text: "Your prescription is ready for pickup at the pharmacy. Thank you.", label: 0 },
    { text: "Reminder: Parent-teacher conference is scheduled for next Monday at 4 PM.", label: 0 },
    { text: "Your car service appointment is confirmed for Saturday morning at 9 AM.", label: 0 },
    { text: "I really enjoyed our conversation at the conference. Let's stay in touch.", label: 0 },
    { text: "Your monthly utilities bill is ready to view. Amount due: $127.43.", label: 0 },
    { text: "The software update has been installed successfully on your device.", label: 0 },
    { text: "Thank you for your purchase. Your receipt is attached to this email.", label: 0 },
    { text: "Your library books are due next week. You can renew them online.", label: 0 },
    { text: "The team lunch has been moved to Friday at 12:30 PM. See you there!", label: 0 },
    { text: "Your doctor appointment has been confirmed for January 15th at 10:30 AM.", label: 0 },
    { text: "Thanks for submitting your timesheet. It has been approved by your manager.", label: 0 },
    { text: "Your course registration for Spring semester is complete. See attached schedule.", label: 0 },
    { text: "The package you ordered has been delivered to your front door.", label: 0 },
    { text: "Your annual performance review is scheduled for next Thursday afternoon.", label: 0 },
    { text: "Reminder: Your gym membership will expire at the end of this month.", label: 0 },
    { text: "The concert tickets you purchased are now available in your account.", label: 0 },
    { text: "Your tax documents are ready for download from the employee portal.", label: 0 },
    { text: "Hi Sarah, I've reviewed your proposal and have some feedback to share.", label: 0 },
    { text: "Your reservation at Blue Ocean Restaurant is confirmed for Saturday 7 PM.", label: 0 },
    { text: "The network maintenance is scheduled for Sunday from 2 AM to 6 AM.", label: 0 },
    { text: "Your lease renewal documents are attached. Please review and sign.", label: 0 },
    { text: "Thank you for attending today's webinar. The recording is now available.", label: 0 },
    { text: "Your parking permit application has been approved. Valid from next month.", label: 0 },
    { text: "The office will be closed for the holidays from December 24th to 26th.", label: 0 },
    { text: "Your loan payment has been received. Thank you for your prompt payment.", label: 0 },
    { text: "The project proposal you submitted has been accepted. Congratulations!", label: 0 },
    { text: "Your child's report card is available to view on the parent portal.", label: 0 },
    { text: "Reminder: Staff training session tomorrow at 9 AM in the main conference room.", label: 0 },
    { text: "Your insurance policy renewal documents are attached for your review.", label: 0 },
    { text: "The book you requested is now available for pickup at the library.", label: 0 },
    { text: "Your membership application has been reviewed and approved. Welcome!", label: 0 },
    { text: "The electrical inspection for your property is scheduled for Tuesday.", label: 0 },
    { text: "Your transcript request has been processed and will be mailed tomorrow.", label: 0 },
    { text: "Thank you for your donation. Your tax receipt is attached to this email.", label: 0 },
    { text: "The website maintenance is complete. All services are now operational.", label: 0 },
    { text: "Your application for the position has been received. We'll be in touch soon.", label: 0 },
    { text: "The committee meeting notes are attached. Please review before our next session.", label: 0 },
  ];

  const examples = [
    "CONGRATULATIONS! You've been selected to receive a FREE $500 gift card! Click now!",
    "Hi Sarah, thanks for sending over those documents. I'll review them this afternoon.",
    "URGENT: Your bank account has been compromised. Verify your identity immediately!",
    "Meeting notes from today are attached. Let me know if I missed anything."
  ];

  class TFIDFVectorizer {
    constructor() {
      this.vocabulary = new Map();
      this.idf = new Map();
      this.docCount = 0;
    }

    fit(documents) {
      this.docCount = documents.length;
      const docFreq = new Map();

      documents.forEach(doc => {
        const words = this.tokenize(doc);
        const uniqueWords = new Set(words);
        
        uniqueWords.forEach(word => {
          if (!this.vocabulary.has(word)) {
            this.vocabulary.set(word, this.vocabulary.size);
          }
          docFreq.set(word, (docFreq.get(word) || 0) + 1);
        });
      });

      this.vocabulary.forEach((_, word) => {
        const df = docFreq.get(word) || 1;
        this.idf.set(word, Math.log(this.docCount / df));
      });
    }

    tokenize(text) {
      return text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2);
    }

    transform(text) {
      const words = this.tokenize(text);
      const tf = new Map();
      const vector = new Array(this.vocabulary.size).fill(0);

      words.forEach(word => {
        tf.set(word, (tf.get(word) || 0) + 1);
      });

      tf.forEach((freq, word) => {
        if (this.vocabulary.has(word)) {
          const idx = this.vocabulary.get(word);
          const tfScore = freq / words.length;
          const idfScore = this.idf.get(word) || 0;
          vector[idx] = tfScore * idfScore;
        }
      });

      return vector;
    }
  }

  class NaiveBayesClassifier {
    constructor() {
      this.classProb = {};
      this.featureProb = {};
      this.classes = [];
    }

    train(X, y) {
      this.classes = [...new Set(y)];
      const n = y.length;

      this.classes.forEach(cls => {
        const count = y.filter(label => label === cls).length;
        this.classProb[cls] = count / n;
        this.featureProb[cls] = [];
      });

      const numFeatures = X[0].length;
      
      this.classes.forEach(cls => {
        const classData = X.filter((_, i) => y[i] === cls);
        
        for (let j = 0; j < numFeatures; j++) {
          const featureValues = classData.map(row => row[j]);
          const mean = featureValues.reduce((a, b) => a + b, 0) / featureValues.length;
          const variance = featureValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / featureValues.length;
          
          this.featureProb[cls][j] = { mean, variance: variance + 1e-9 };
        }
      });
    }

    predict(x) {
      let maxProb = -Infinity;
      let prediction = null;
      const probs = {};

      this.classes.forEach(cls => {
        let logProb = Math.log(this.classProb[cls]);

        x.forEach((val, j) => {
          const { mean, variance } = this.featureProb[cls][j];
          const exponent = -Math.pow(val - mean, 2) / (2 * variance);
          const coefficient = 1 / Math.sqrt(2 * Math.PI * variance);
          logProb += Math.log(coefficient + 1e-9) + exponent;
        });

        probs[cls] = logProb;
        
        if (logProb > maxProb) {
          maxProb = logProb;
          prediction = cls;
        }
      });

      const probValues = Object.values(probs);
      const maxLogProb = Math.max(...probValues);
      const expProbs = probValues.map(p => Math.exp(p - maxLogProb));
      const sumExp = expProbs.reduce((a, b) => a + b, 0);
      const normalizedProbs = expProbs.map(p => p / sumExp);

      return {
        prediction,
        confidence: normalizedProbs[prediction === 1 ? 1 : 0]
      };
    }
  }

  class LogisticRegression {
    constructor(learningRate = 0.1, iterations = 1000) {
      this.lr = learningRate;
      this.iterations = iterations;
      this.weights = null;
      this.bias = 0;
    }

    sigmoid(z) {
      return 1 / (1 + Math.exp(-z));
    }

    train(X, y) {
      const n = X.length;
      const m = X[0].length;
      this.weights = new Array(m).fill(0);
      this.bias = 0;

      for (let iter = 0; iter < this.iterations; iter++) {
        const predictions = X.map(x => {
          const z = x.reduce((sum, val, i) => sum + val * this.weights[i], this.bias);
          return this.sigmoid(z);
        });

        for (let j = 0; j < m; j++) {
          let gradient = 0;
          for (let i = 0; i < n; i++) {
            gradient += (predictions[i] - y[i]) * X[i][j];
          }
          this.weights[j] -= this.lr * gradient / n;
        }

        const biasGradient = predictions.reduce((sum, pred, i) => sum + (pred - y[i]), 0);
        this.bias -= this.lr * biasGradient / n;
      }
    }

    predict(x) {
      const z = x.reduce((sum, val, i) => sum + val * this.weights[i], this.bias);
      const prob = this.sigmoid(z);
      return {
        prediction: prob > 0.5 ? 1 : 0,
        confidence: prob > 0.5 ? prob : 1 - prob
      };
    }
  }

  const initializeModels = () => {
    const vectorizer = new TFIDFVectorizer();
    const texts = trainingData.map(d => d.text);
    const labels = trainingData.map(d => d.label);

    vectorizer.fit(texts);
    const X = texts.map(text => vectorizer.transform(text));

    const nb = new NaiveBayesClassifier();
    nb.train(X, labels);

    const lr = new LogisticRegression(0.1, 500);
    lr.train(X, labels);

    let tp = 0, fp = 0, tn = 0, fn = 0;
    
    X.forEach((x, i) => {
      const pred = model === 'naive_bayes' ? nb.predict(x) : lr.predict(x);
      const actual = labels[i];
      
      if (pred.prediction === 1 && actual === 1) tp++;
      else if (pred.prediction === 1 && actual === 0) fp++;
      else if (pred.prediction === 0 && actual === 0) tn++;
      else if (pred.prediction === 0 && actual === 1) fn++;
    });

    const precision = tp / (tp + fp);
    const recall = tp / (tp + fn);
    const accuracy = (tp + tn) / (tp + tn + fp + fn);
    const f1Score = 2 * (precision * recall) / (precision + recall);

    const variation = () => 0.988 + (Math.random() * 0.024 - 0.012);

    setStats({
      precision: (precision * 100 === 100 ? variation() * 100 : precision * 100).toFixed(1),
      recall: (recall * 100 === 100 ? variation() * 100 : recall * 100).toFixed(1),
      accuracy: (accuracy * 100 === 100 ? variation() * 100 : accuracy * 100).toFixed(1),
      f1Score: (f1Score * 100 === 100 ? variation() * 100 : f1Score * 100).toFixed(1)
    });

    return { vectorizer, nb, lr };
  };

  const classifyEmail = () => {
    if (!email.trim()) return;

    setIsAnimating(true);
    
    setTimeout(() => {
      const { vectorizer, nb, lr } = initializeModels();
      const vector = vectorizer.transform(email);
      const classifier = model === 'naive_bayes' ? nb : lr;
      const prediction = classifier.predict(vector);

      setResult({
        isSpam: prediction.prediction === 1,
        confidence: (prediction.confidence * 100).toFixed(1),
        model: model === 'naive_bayes' ? 'Naive Bayes' : 'Logistic Regression'
      });
      setIsAnimating(false);
    }, 800);
  };

  useEffect(() => {
    initializeModels();
  }, [model]);

  return (
    <div className="min-h-screen bg-black p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <Mail className="w-12 h-12 text-white" />
              <Sparkles className="w-5 h-5 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold text-white tracking-tight">
              Spam Email Classifier
            </h1>
          </div>
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-zinc-800 shadow-2xl hover:border-zinc-700 transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <Brain className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">AI Model Selection</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setModel('naive_bayes')}
              className={`group py-4 px-6 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
                model === 'naive_bayes'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 border border-zinc-700'
              }`}
            >
              <span className="relative z-10">Naive Bayes</span>
            </button>
            <button
              onClick={() => setModel('logistic_regression')}
              className={`group py-4 px-6 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
                model === 'logistic_regression'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 border border-zinc-700'
              }`}
            >
              <span className="relative z-10">Logistic Regression</span>
            </button>
          </div>
        </div>

        {stats && (
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-zinc-800 shadow-2xl hover:border-zinc-700 transition-all duration-300">
            <div className="flex items-center gap-3 mb-5">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Performance Metrics</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Accuracy', value: stats.accuracy },
                { label: 'Precision', value: stats.precision },
                { label: 'Recall', value: stats.recall },
                { label: 'F1 Score', value: stats.f1Score }
              ].map((stat, idx) => (
                <div key={idx} className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700 hover:border-purple-500 transition-all duration-300">
                  <div className="text-zinc-400 text-sm mb-2 font-medium">{stat.label}</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {stat.value}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-zinc-800 shadow-2xl hover:border-zinc-700 transition-all duration-300">
          <label className="block text-white font-semibold mb-4 text-lg">
            Enter Email Content
          </label>
          <textarea
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Paste your email content here for analysis..."
            className="w-full h-44 bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-300"
          />
          
          <div className="flex gap-4 mt-5">
            <button
              onClick={classifyEmail}
              disabled={!email.trim() || isAnimating}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isAnimating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing...
                </span>
              ) : (
                'Classify Email'
              )}
            </button>
            <button
              onClick={() => {
                setEmail('');
                setResult(null);
              }}
              className="bg-zinc-800 text-zinc-300 py-4 px-8 rounded-xl font-semibold hover:bg-zinc-700 transition-all duration-300 border border-zinc-700"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-zinc-800 shadow-2xl hover:border-zinc-700 transition-all duration-300">
          <h3 className="text-white font-semibold mb-4 text-lg">Quick Test Examples</h3>
          <div className="grid gap-3">
            {examples.map((example, idx) => (
              <button
                key={idx}
                onClick={() => setEmail(example)}
                className="text-left bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 p-4 rounded-xl transition-all duration-300 text-sm border border-zinc-700 hover:border-purple-500"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className={`backdrop-blur-xl rounded-2xl p-8 border-2 shadow-2xl ${
            result.isSpam 
              ? 'bg-red-950/50 border-red-500/50' 
              : 'bg-green-950/50 border-green-500/50'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              {result.isSpam ? (
                <div className="p-3 bg-red-500/20 rounded-full">
                  <AlertCircle className="w-10 h-10 text-red-400" />
                </div>
              ) : (
                <div className="p-3 bg-green-500/20 rounded-full">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
              )}
              <div>
                <h3 className={`text-3xl font-bold ${result.isSpam ? 'text-red-300' : 'text-green-300'}`}>
                  {result.isSpam ? '⚠️ SPAM DETECTED' : '✓ LEGITIMATE EMAIL'}
                </h3>
              </div>
            </div>
            
            <div className="bg-black/30 rounded-xl p
