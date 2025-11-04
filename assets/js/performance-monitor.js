/**
 * Hostinger Performance Monitoring Script
 * Monitors website performance and provides real-time metrics
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;

        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();

        // Track page load timing
        this.trackPageLoadTiming();

        // Monitor resource loading
        this.monitorResourceLoading();

        // Track user interactions
        this.trackUserInteractions();

        // Report metrics to analytics
        this.reportMetrics();

        this.isInitialized = true;
    }

    monitorCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
                this.logMetric('LCP', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        }

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.metrics.fid = entry.processingStart - entry.startTime;
                this.logMetric('FID', this.metrics.fid);
            });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsScore += entry.value;
                    this.metrics.cls = clsScore;
                    this.logMetric('CLS', clsScore);
                }
            });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    trackPageLoadTiming() {
        window.addEventListener('load', () => {
            const timing = performance.timing;
            this.metrics.pageLoad = {
                dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
                tcpConnection: timing.connectEnd - timing.connectStart,
                serverResponse: timing.responseEnd - timing.requestStart,
                domLoad: timing.domContentLoadedEventEnd - timing.navigationStart,
                fullPageLoad: timing.loadEventEnd - timing.navigationStart,
                firstPaint: 0,
                firstContentfulPaint: 0
            };

            // Get paint timings
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                if (entry.name === 'first-paint') {
                    this.metrics.pageLoad.firstPaint = entry.startTime;
                } else if (entry.name === 'first-contentful-paint') {
                    this.metrics.pageLoad.firstContentfulPaint = entry.startTime;
                }
            });

            this.logMetric('PageLoad', this.metrics.pageLoad);
        });
    }

    monitorResourceLoading() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            this.metrics.resources = {
                total: resources.length,
                images: resources.filter(r => r.initiatorType === 'img').length,
                scripts: resources.filter(r => r.initiatorType === 'script').length,
                stylesheets: resources.filter(r => r.initiatorType === 'link').length,
                totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
                cachedResources: resources.filter(r => r.transferSize === 0).length,
                loadTime: Math.max(...resources.map(r => r.duration))
            };

            this.logMetric('Resources', this.metrics.resources);
        });
    }

    trackUserInteractions() {
        let interactionCount = 0;
        const interactions = ['click', 'scroll', 'keypress', 'touchstart'];

        interactions.forEach(event => {
            document.addEventListener(event, () => {
                interactionCount++;
                this.metrics.interactions = interactionCount;

                // Track time to first interaction
                if (interactionCount === 1 && !this.metrics.firstInteraction) {
                    this.metrics.firstInteraction = performance.now();
                    this.logMetric('FirstInteraction', this.metrics.firstInteraction);
                }
            }, { once: event === 'click' });
        });
    }

    logMetric(name, value) {
        console.log(`📊 ${name}:`, value);

        // Store in localStorage for debugging
        const storedMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '{}');
        storedMetrics[name] = value;
        storedMetrics.timestamp = Date.now();
        localStorage.setItem('performanceMetrics', JSON.stringify(storedMetrics));
    }

    reportMetrics() {
        // Report to Google Analytics if available
        if (typeof gtag === 'function') {
            this.reportToGoogleAnalytics();
        }

        // Report to custom analytics endpoint
        this.reportToCustomEndpoint();
    }

    reportToGoogleAnalytics() {
        if (this.metrics.lcp) {
            gtag('event', 'lcp', {
                'metric_value': Math.round(this.metrics.lcp),
                'metric_id': 'LCP'
            });
        }

        if (this.metrics.fid) {
            gtag('event', 'fid', {
                'metric_value': Math.round(this.metrics.fid),
                'metric_id': 'FID'
            });
        }

        if (this.metrics.cls) {
            gtag('event', 'cls', {
                'metric_value': Math.round(this.metrics.cls * 1000),
                'metric_id': 'CLS'
            });
        }
    }

    reportToCustomEndpoint() {
        // Send performance metrics to custom endpoint (DISABLED to avoid 405 errors)
        // Note: Uncomment this section if you have a backend API endpoint
        /*
        setTimeout(() => {
            const data = {
                url: window.location.href,
                timestamp: Date.now(),
                metrics: this.metrics,
                userAgent: navigator.userAgent,
                connection: navigator.connection ? {
                    effectiveType: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink,
                    rtt: navigator.connection.rtt
                } : null
            };

            // Send to analytics endpoint (optional)
            fetch('/api/performance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).catch(() => {
                // Silently fail if endpoint doesn't exist
            });
        }, 5000);
        */
    }

    getPerformanceScore() {
        if (!this.metrics.pageLoad) return 0;

        const scores = {
            lcp: this.metrics.lcp ? this.calculateLCPScore(this.metrics.lcp) : 0,
            fid: this.metrics.fid ? this.calculateFIDScore(this.metrics.fid) : 0,
            cls: this.metrics.cls ? this.calculateCLSScore(this.metrics.cls) : 0,
            loadTime: this.calculateLoadTimeScore(this.metrics.pageLoad.fullPageLoad)
        };

        return Math.round((scores.lcp + scores.fid + scores.cls + scores.loadTime) / 4);
    }

    calculateLCPScore(lcp) {
        if (lcp < 2400) return 100;
        if (lcp < 4000) return 75;
        return 50;
    }

    calculateFIDScore(fid) {
        if (fid < 100) return 100;
        if (fid < 300) return 75;
        return 50;
    }

    calculateCLSScore(cls) {
        if (cls < 0.1) return 100;
        if (cls < 0.25) return 75;
        return 50;
    }

    calculateLoadTimeScore(loadTime) {
        if (loadTime < 3000) return 100;
        if (loadTime < 5000) return 75;
        return 50;
    }
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    window.performanceMonitor = new PerformanceMonitor();

    // Log performance score after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            const score = window.performanceMonitor.getPerformanceScore();
            console.log(`🎯 Performance Score: ${score}/100`);

            // Display score in console for debugging
            console.table({
                'Metric': ['LCP', 'FID', 'CLS', 'Load Time', 'Overall'],
                'Score': [
                    window.performanceMonitor.calculateLCPScore(window.performanceMonitor.metrics.lcp || 0),
                    window.performanceMonitor.calculateFIDScore(window.performanceMonitor.metrics.fid || 0),
                    window.performanceMonitor.calculateCLSScore(window.performanceMonitor.metrics.cls || 0),
                    window.performanceMonitor.calculateLoadTimeScore(window.performanceMonitor.metrics.pageLoad?.fullPageLoad || 0),
                    score
                ]
            });
        }, 2000);
    });
});

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}