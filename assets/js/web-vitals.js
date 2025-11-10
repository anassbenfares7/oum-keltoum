// Core Web Vitals Monitoring
class WebVitalsMonitor {
  constructor() {
    this.metrics = {
      FCP: null, // First Contentful Paint
      LCP: null, // Largest Contentful Paint
      FID: null, // First Input Delay
      CLS: null, // Cumulative Layout Shift
      TTFB: null // Time to First Byte
    };
    this.init();
  }

  init() {
    // Only monitor in production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return;
    }

    this.observeFCP();
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeTTFB();
  }

  observeFCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        this.metrics.FCP = entries[0].startTime;
        this.logMetric('FCP', this.metrics.FCP);
      }
    });

    observer.observe({ entryTypes: ['paint'] });
  }

  observeLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        this.metrics.LCP = entries[entries.length - 1].startTime;
        this.logMetric('LCP', this.metrics.LCP);
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  observeFID() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        this.metrics.FID = entries[0].processingStart - entries[0].startTime;
        this.logMetric('FID', this.metrics.FID);
      }
    });

    observer.observe({ entryTypes: ['first-input'] });
  }

  observeCLS() {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.metrics.CLS = clsValue;
      this.logMetric('CLS', this.metrics.CLS);
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }

  observeTTFB() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.metrics.TTFB = navigation.responseStart - navigation.requestStart;
      this.logMetric('TTFB', this.metrics.TTFB);
    }
  }

  logMetric(name, value) {
    const thresholds = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 600, poor: 1400 }
    };

    const threshold = thresholds[name];
    let rating = 'good';

    if (threshold) {
      if (name === 'CLS') {
        if (value > threshold.poor) rating = 'poor';
        else if (value > threshold.good) rating = 'needs-improvement';
      } else {
        if (value > threshold.poor) rating = 'poor';
        else if (value > threshold.good) rating = 'needs-improvement';
      }
    }

    

    // Store for analytics
    if (window.gtag) {
      window.gtag('event', 'web_vital', {
        metric_name: name,
        metric_value: Math.round(value * 100) / 100,
        metric_rating: rating
      });
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new WebVitalsMonitor());
} else {
  new WebVitalsMonitor();
}