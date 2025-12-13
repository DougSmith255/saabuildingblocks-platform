'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import styles from './GlassShimmer.module.css';

interface SocialIcon {
  name: string;
  href: string;
  icon: string;
  label: string;
}

const socialIcons: SocialIcon[] = [
  {
    name: 'Email',
    href: 'mailto:team@smartagentalliance.com',
    icon: "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 512 512%27%3E%3Cpath fill=%27%2396a9b2%27 d=%27M511.824 425.007c1.941-5.245-220.916-173.519-220.916-173.519c-27.9-20.589-42.574-20.913-70.164 0c0 0-222.532 168.138-220.659 173.311l-.045.038c.023.045.06.076.091.117a48.5 48.5 0 0 0 8.119 14.157c1.473 1.786 3.248 3.282 4.955 4.837l-.083.064c.136.121.317.177.453.298c7.235 6.454 16.359 10.634 26.495 11.827c.159.019.287.102.446.121h.612c1.541.147 3.006.517 4.584.517h420.721c20.717 0 38.269-13.028 45.241-31.291c.083-.136.211-.234.287-.374z%27/%3E%3Cpath fill=%27%23b9c5c6%27 d=%27M256.133 232.176L1.216 423.364V152.515c0-26.4 21.397-47.797 47.797-47.797h414.24c26.4 0 47.797 21.397 47.797 47.797v270.849z%27/%3E%3Cpath fill=%27%23edece6%27 d=%27m4.189 135.896l217.645 170.949c27.47 20.271 41.918 20.591 69.083 0L508.22 136.167c-3.77-6.834-9.414-12.233-15.869-16.538l2.989-2.342c-7.295-6.641-16.62-10.946-26.971-12.058l-424.455.015c-10.322 1.097-19.662 5.417-26.942 12.043l2.967 2.313c-6.38 4.245-11.972 9.551-15.75 16.296%27/%3E%3Cpath fill=%27%23dce2e2%27 d=%27M4.118 136.254C2.207 141.419 221.63 307.099 221.63 307.099c27.47 20.271 41.918 20.591 69.083 0c0 0 219.103-165.546 217.258-170.64l.045-.037c-.022-.045-.059-.074-.089-.115a47.7 47.7 0 0 0-7.994-13.939c-1.45-1.759-3.198-3.231-4.878-4.763l.082-.063c-.134-.119-.312-.175-.446-.294c-7.124-6.354-16.107-10.47-26.086-11.645c-.156-.019-.283-.1-.439-.119h-.602c-1.517-.145-2.96-.509-4.514-.509H48.81c-20.398 0-37.68 12.828-44.543 30.809c-.082.134-.208.231-.283.368z%27/%3E%3Cpath fill=%27%23597b91%27 d=%27M291.401 154.645h-38.632a6.155 6.155 0 0 0-6.155 6.155v21.722a6.155 6.155 0 0 0 6.155 6.155h31.415a6.155 6.155 0 0 1 6.155 6.155v11.616a6.155 6.155 0 0 1-6.155 6.155h-31.415a6.155 6.155 0 0 0-6.155 6.155v23.578a6.155 6.155 0 0 0 6.155 6.155h41.316a6.155 6.155 0 0 1 6.155 6.155v12.441a6.155 6.155 0 0 1-6.155 6.155h-75.76a6.155 6.155 0 0 1-6.155-6.155V136.461a6.155 6.155 0 0 1 6.155-6.155h74.81c3.749 0 6.627 3.322 6.092 7.033l-1.733 12.028a6.156 6.156 0 0 1-6.093 5.278%27/%3E%3C/svg%3E')",
    label: 'Email'
  },
  {
    name: 'Webinar',
    href: '/join-exp-sponsor-team/webinar-registration/',
    icon: "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%27-3 -3 30 30%27%3E%3Cg fill=%27none%27%3E%3Cpath fill=%27%2366e1ff%27 d=%27M3.984 3.04A1.886 1.886 0 0 1 5.87 1.155h12.26a1.886 1.886 0 0 1 1.886 1.887v7.544a1.887 1.887 0 0 1-1.886 1.886H5.87a1.886 1.886 0 0 1-1.886-1.886z%27/%3E%3Cpath fill=%27%23c2f3ff%27 d=%27M5.87 1.154a1.886 1.886 0 0 0-1.886 1.887v7.544a1.88 1.88 0 0 0 1.037 1.678L16.137 1.154z%27/%3E%3Cpath stroke=%27%23191919%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27M3.984 3.04A1.886 1.886 0 0 1 5.87 1.155h12.26a1.886 1.886 0 0 1 1.886 1.887v7.544a1.887 1.887 0 0 1-1.886 1.886H5.87a1.886 1.886 0 0 1-1.886-1.886z%27 stroke-width=%271%27/%3E%3Cpath fill=%27%23fff%27 d=%27M16.432 10.609c-.365-.566-1.573-.971-3.087-1.532c-.427-.159-.357-1.274-.168-1.482a3.15 3.15 0 0 0 .82-2.444a2.003 2.003 0 1 0-4 0a3.15 3.15 0 0 0 .821 2.444c.189.208.26 1.32-.168 1.482c-1.509.566-2.718.969-3.083 1.532%27/%3E%3Cpath stroke=%27%23191919%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27M16.432 10.609c-.365-.566-1.573-.971-3.087-1.532c-.427-.159-.357-1.274-.168-1.482a3.15 3.15 0 0 0 .82-2.444a2.003 2.003 0 1 0-4 0a3.15 3.15 0 0 0 .821 2.444c.189.208.26 1.32-.168 1.482c-1.509.566-2.718.969-3.083 1.532%27 stroke-width=%271%27/%3E%3Cpath fill=%27%23ffdda1%27 d=%27M16.244 22.846a3.75 3.75 0 0 0-.37-1.497c-.26-.52-1.346-.882-2.71-1.387c-.37-.136-.309-.997-.146-1.177a2.72 2.72 0 0 0 .709-2.111a1.73 1.73 0 1 0-3.454 0a2.72 2.72 0 0 0 .708 2.11c.163.18.225 1.038-.145 1.178c-1.365.505-2.452.866-2.711 1.387a3.8 3.8 0 0 0-.37 1.497%27/%3E%3Cpath stroke=%27%23191919%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27M16.244 22.846a3.75 3.75 0 0 0-.37-1.497c-.26-.52-1.346-.882-2.71-1.387c-.37-.136-.309-.997-.146-1.177a2.72 2.72 0 0 0 .709-2.111a1.73 1.73 0 1 0-3.454 0a2.72 2.72 0 0 0 .708 2.11c.163.18.225 1.038-.145 1.178c-1.365.505-2.452.866-2.711 1.387a3.8 3.8 0 0 0-.37 1.497%27/%3E%3Cpath fill=%27%23ffdda1%27 d=%27M22.845 20.408c-.358-.14-.762-.283-1.194-.447c-.37-.135-.308-.996-.145-1.176a2.72 2.72 0 0 0 .708-2.111a1.73 1.73 0 1 0-3.453 0a2.72 2.72 0 0 0 .708 2.11c.163.18.224 1.038-.145 1.177c-1.365.506-2.452.867-2.712 1.388c-.225.468-.35.977-.368 1.496h5.47c1.219-.064 1.508-.957 1.131-2.437%27/%3E%3Cpath stroke=%27%23191919%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27M22.845 20.408c-.358-.14-.762-.283-1.194-.447c-.37-.135-.308-.996-.145-1.176a2.72 2.72 0 0 0 .708-2.111a1.73 1.73 0 1 0-3.453 0a2.72 2.72 0 0 0 .708 2.11c.163.18.224 1.038-.145 1.177c-1.365.506-2.452.867-2.712 1.388c-.225.468-.35.977-.368 1.496%27 stroke-width=%271%27/%3E%3Cpath fill=%27%23ffdda1%27 d=%27M1.155 20.408c.358-.14.762-.283 1.194-.447c.37-.135.308-.996.145-1.176a2.72 2.72 0 0 1-.709-2.111a1.73 1.73 0 1 1 3.454 0a2.72 2.72 0 0 1-.708 2.11c-.163.18-.225 1.038.145 1.177c1.365.506 2.452.867 2.711 1.388c.226.468.351.978.37 1.496h-5.47c-1.22-.064-1.51-.957-1.132-2.437%27/%3E%3Cpath stroke=%27%23191919%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27M1.155 20.408c.358-.14.762-.283 1.194-.447c.37-.135.308-.996.145-1.176a2.72 2.72 0 0 1-.708-2.111a1.73 1.73 0 1 1 3.453 0a2.72 2.72 0 0 1-.708 2.11c-.163.18-.224 1.038.145 1.177c1.365.506 2.452.867 2.712 1.388c.225.468.35.978.368 1.496%27 stroke-width=%271%27/%3E%3C/g%3E%3C/svg%3E')",
    label: 'Webinar'
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@SmartAgentAlliance',
    icon: "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%271.43em%27 height=%271em%27 viewBox=%270 0 256 180%27%3E%3Cpath fill=%27red%27 d=%27M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134%27/%3E%3Cpath fill=%27%23FFF%27 d=%27m102.421 128.06l66.328-38.418l-66.328-38.418z%27/%3E%3C/svg%3E')",
    label: 'YouTube'
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/smart-agent-alliance',
    icon: "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27256%27 height=%27256%27 viewBox=%27-26 -26 308 308%27%3E%3Cg fill=%27none%27%3E%3Crect width=%27256%27 height=%27256%27 fill=%27%23fff%27 rx=%2760%27/%3E%3Crect width=%27256%27 height=%27256%27 fill=%27%230a66c2%27 rx=%2760%27/%3E%3Cpath fill=%27%23fff%27 d=%27M184.715 217.685h29.27a4 4 0 0 0 4-3.999l.015-61.842c0-32.323-6.965-57.168-44.738-57.168c-14.359-.534-27.9 6.868-35.207 19.228a.32.32 0 0 1-.595-.161V101.66a4 4 0 0 0-4-4h-27.777a4 4 0 0 0-4 4v112.02a4 4 0 0 0 4 4h29.268a4 4 0 0 0 4-4v-55.373c0-15.657 2.97-30.82 22.381-30.82c19.135 0 19.383 17.916 19.383 31.834v54.364a4 4 0 0 0 4 4M38 59.628c0 11.864 9.767 21.626 21.632 21.626c11.862-.001 21.623-9.769 21.623-21.631C81.253 47.761 71.491 38 59.628 38C47.762 38 38 47.763 38 59.627m6.959 158.058h29.307a4 4 0 0 0 4-4V101.66a4 4 0 0 0-4-4H44.959a4 4 0 0 0-4 4v112.025a4 4 0 0 0 4 4%27/%3E%3C/g%3E%3C/svg%3E')",
    label: 'LinkedIn'
  },
  {
    name: 'Book a Call',
    href: '/join-exp-sponsor-team/book-a-call/',
    icon: "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%271em%27 height=%271em%27 viewBox=%270 0 48 48%27%3E%3Cpath fill=%27%23CFD8DC%27 d=%27M5 38V14h38v24c0 2.2-1.8 4-4 4H9c-2.2 0-4-1.8-4-4%27/%3E%3Cpath fill=%27%23F44336%27 d=%27M43 10v6H5v-6c0-2.2 1.8-4 4-4h30c2.2 0 4 1.8 4 4%27/%3E%3Cg fill=%27%23B71C1C%27%3E%3Ccircle cx=%2733%27 cy=%2710%27 r=%273%27/%3E%3Ccircle cx=%2715%27 cy=%2710%27 r=%273%27/%3E%3C/g%3E%3Cpath fill=%27%23B0BEC5%27 d=%27M33 3c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2s2-.9 2-2V5c0-1.1-.9-2-2-2M15 3c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2s2-.9 2-2V5c0-1.1-.9-2-2-2%27/%3E%3Cpath fill=%27%2390A4AE%27 d=%27M13 20h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zm-18 6h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zm-18 6h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4z%27/%3E%3C/svg%3E')",
    label: 'Book a Call'
  }
];

export default function Footer() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [wasAtBottom, setWasAtBottom] = useState(false);
  const [animatingIcons, setAnimatingIcons] = useState<Set<number>>(new Set());
  const footerRef = useRef<HTMLElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll-to-bottom wave animation trigger - triggers EVERY time user scrolls to bottom
  useEffect(() => {
    let ticking = false;

    const checkBottomReached = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );

      // Trigger when within 50px of bottom (WordPress spec)
      const isAtBottom = scrollTop + windowHeight >= documentHeight - 50;

      // KEY FIX: Trigger animation EVERY time user reaches bottom
      // Reset wasAtBottom when user scrolls away from bottom (creates fresh trigger)
      if (isAtBottom && !wasAtBottom) {
        triggerWaveAnimation();
        setWasAtBottom(true);
      } else if (!isAtBottom && wasAtBottom) {
        // User scrolled away from bottom - reset state for next trigger
        setWasAtBottom(false);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          checkBottomReached();
          ticking = false;
        });
        ticking = true;
      }
    };

    // window.addEventListener('scroll', handleScroll, { passive: true }); // Disabled - scroll trigger removed

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [wasAtBottom, isAnimating]);

  const triggerWaveAnimation = () => {
    setIsAnimating(true);

    // Sequential animation with 200ms stagger per icon (WordPress spec)
    socialIcons.forEach((_, index) => {
      setTimeout(() => {
        setAnimatingIcons(prev => {
          const updated = new Set(prev);
          updated.add(index);
          return updated;
        });

        // Remove animation class after 1200ms (animation duration)
        setTimeout(() => {
          setAnimatingIcons(prev => {
            const updated = new Set(prev);
            updated.delete(index);
            return updated;
          });
        }, 1200);
      }, index * 200);
    });

    // Reset animating state after all animations complete
    // Total: 5 icons × 200ms stagger + 1200ms animation = 2200ms
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 5 * 200 + 1200);
  };

  return (
    <footer ref={footerRef} role="contentinfo" className="footer-wrapper">
      {/* Glassmorphism Background - Same as Header but with top rounded corners only */}
      <div className={`${styles['glassContainer']} footer-glass-container`}>
        <div className={`${styles['glassBase']} footer-glass-base`} />
        <div className={`${styles['shimmerLayer']} footer-shimmer`} />
        <div className={styles['refractionLayer']} />
        <div className={styles['textureLayer']} />
        <div className={styles['edgeHighlight']} />
      </div>
      <div className="footer-container">
        {/* Logo Section */}
        <div className="footer-logo">
          <Link href="/" className="footer-logo-container" aria-label="Smart Agent Alliance Home">
            <svg width="120px" height="45px" viewBox="0 0 201.96256 75.736626" version="1.1" className="footer-logo-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation">
              <defs>
                <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#fff3b0', stopOpacity: 1}} />
                  <stop offset="40%" style={{stopColor: '#ffd700', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#e6ac00', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              <g transform="translate(-5.5133704,-105.97189)">
                <path fill="url(#footerLogoGradient)" d="M 21.472273,180.56058 C 11.316147,178.12213 1.9355119,166.45773 6.8673475,154.38101 c 0.2284985,-0.55952 1.4152886,-0.30887 8.5218335,-0.25364 6.089186,0.0474 11.528887,-0.54887 11.563021,0.35268 0.12172,3.21493 1.548705,4.66069 2.560443,5.07358 1.092535,0.44586 18.027365,0.14064 18.956531,-0.51505 2.086142,-1.47214 2.326164,-6.74 -0.732868,-6.70809 -1.893125,0.0197 -16.677992,0.18141 -18.724365,-0.11743 -4.043916,-0.59058 -5.591737,-1.59981 -9.49172,-4.13883 -8.077325,-5.25858 -10.5671578,-12.68416 -8.96983,-21.28238 0,0 6.234294,-0.12184 10.651176,-0.37024 4.312501,-0.24253 8.14686,-0.34782 8.671149,0.65635 1.028138,1.96921 2.764824,2.67171 3.10468,3.73011 0.296847,0.92448 1.558671,0.84083 5.661272,0.85056 4.303079,0.01 9.549862,0.24636 14.627167,0.65835 6.271917,0.50893 12.606804,1.04447 18.1587,14.09205 1.256383,2.95263 -0.05146,7.82433 2.707298,0.89052 0.906748,-2.27902 1.363355,-2.02044 15.012644,-2.13873 7.507113,-0.065 13.649301,-0.23577 13.649301,-0.37936 0,-0.1436 -0.28095,-0.89482 -0.62433,-1.66938 -0.34338,-0.77455 -1.02601,-2.31327 -1.51695,-3.41938 -0.49094,-1.10612 -2.062126,-4.92722 -3.491523,-8.49135 -1.429397,-3.56413 -2.857843,-7.08356 -3.174329,-7.82097 -0.316495,-0.7374 -1.226445,-2.94962 -2.022113,-4.91605 -0.795667,-1.96641 -4.043105,-11.29798 -3.693629,-11.88325 0.458064,-0.76712 -0.18677,-0.40385 12.337194,-0.40385 9.84423,0 9.65274,0.24739 9.65274,0.24739 1.2078,1.06083 2.78957,6.78964 3.34621,8.01751 0.55721,1.22913 1.27686,2.83788 1.59864,3.57529 0.60465,1.38564 1.79312,3.9863 4.28898,9.38518 0.79543,1.72061 2.34948,5.13949 3.45345,7.59751 2.67446,5.95472 3.04484,6.75259 5.91254,12.73702 2.46283,5.1395 2.46283,5.1395 3.20091,3.24636 2.23698,-5.73776 1.98186,-5.7611 4.28454,-5.95219 1.54958,-0.1286 24.51316,0.54777 24.82611,0.0215 0,0 -3.59658,-6.2074 -5.83995,-10.49576 -8.26158,-15.79266 -13.92752,-27.26401 -13.81355,-28.2205 0.0424,-0.35537 5.59171,-0.19826 13.73661,-0.17244 11.92585,0.0378 11.19138,0.12582 11.45775,0.44068 0.7756,0.9168 5.56816,10.25269 6.3956,11.61578 0.82745,1.36309 2.32581,3.98669 3.32968,5.83019 1.00389,1.84351 2.17996,3.95518 2.61353,4.69258 0.43356,0.7374 1.35628,2.34629 2.0505,3.5753 0.6942,1.22901 3.48408,6.15623 6.19971,10.94936 2.71564,4.79315 6.57201,11.63091 8.5697,15.19503 1.99772,3.56414 3.98079,6.98302 4.40686,7.59753 1.75557,2.53202 7.19727,12.85738 7.19727,13.65646 0,1.35047 -1.83096,1.53856 -14.97656,1.53856 -15.12194,0 -11.00005,0.41867 -13.10487,-0.35263 -2.71179,-0.99372 -7.4667,-12.35312 -8.24465,-13.49738 -0.5144,-0.75665 -20.11115,-0.50211 -20.85813,0.10747 -0.30114,0.24573 -4.74222,12.87268 -5.21806,13.18149 -0.51253,0.33263 1.56565,0.31373 -13.12083,0.46948 -14.37638,0.15246 -12.92516,-0.20864 -13.7378,-0.46876 -1.39249,-0.44578 -3.05836,-6.3221 -3.28223,-6.8137 -0.2239,-0.4916 -1.69614,-6.08358 -2.6942,-7.30424 -0.46821,-0.57263 -22.000524,-0.10018 -22.427167,0.30027 -0.495999,0.46555 -2.403531,4.97746 -3.536292,7.45088 -3.647579,7.96455 -0.798091,6.48322 -14.189162,6.21687 -7.764148,-0.15444 -10.944164,0.0682 -12.663388,-0.49314 -2.370345,-0.7739 -1.493164,-2.84033 -1.713395,-2.39718 -2.970363,5.97706 -32.338174,3.84174 -36.236923,2.90565 z m 12.24087,-53.49377 c -0.644922,-0.55276 -1.868417,-1.61286 -2.718877,-2.35578 C 28.5887,122.6096 17.54033,106.32825 20.700077,106.24689 c 18.520277,-0.47684 31.530155,-0.22018 43.622587,-0.0695 12.878883,18.49983 14.110357,21.6067 12.221476,21.31699 -20.587891,-5.5e-4 -41.658407,0.57749 -42.830997,-0.42752 z" />
              </g>
            </svg>
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="footer-social">
          <nav className="links">
            {socialIcons.map((social, index) => {
              const isInternal = social.href.startsWith('/') && !social.href.startsWith('//');
              const className = `link ${animatingIcons.has(index) ? 'wave-animate' : ''}`;
              const style = { '--icon': social.icon } as React.CSSProperties;

              return isInternal ? (
                <Link
                  key={social.name}
                  href={social.href}
                  className={className}
                  style={style}
                  aria-label={social.label}
                />
              ) : (
                <a
                  key={social.name}
                  className={className}
                  href={social.href}
                  style={style}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                />
              );
            })}
          </nav>
        </div>

        {/* Rocket Icon */}
        <div className="footer-rocket">
          <svg className="rocket-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C4.21 7.51 3 10.62 3 14c0 4.42 3.58 8 8 8s8-3.58 8-8C19 8.61 16.41 3.8 12.5.67zM10.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
          </svg>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-nav-links">
            <Link href="/privacy-policy/" className="footer-nav-link">Privacy Policy</Link>
            <Link href="/disclaimer/" className="footer-nav-link">Disclaimer</Link>
            <Link href="/terms-of-use/" className="footer-nav-link">Terms of Use</Link>
            <Link href="/cookie-policy/" className="footer-nav-link">Cookie Policy</Link>
          </div>
          <div className="footer-copyright">
            Copyright © {new Date().getFullYear()} – SmartAgentAlliance.com
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Footer Container - Positioned at bottom of content */
        /* Matches header styling but with TOP rounded corners only */
        .footer-wrapper {
          position: relative;
          width: 100%;
          background: transparent;
          margin-top: auto;
          border-radius: 20px 20px 0 0;
          border-top: 2px solid rgba(60, 60, 60, 0.8);
          box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        /* Override glassmorphism module styles for footer - TOP corners only */
        :global(.footer-glass-container) {
          border-radius: 20px 20px 0 0 !important;
          top: 0 !important;
          bottom: -5px !important;
        }

        :global(.footer-glass-base) {
          border-radius: 20px 20px 0 0 !important;
        }

        :global(.footer-glass-base::after) {
          border-radius: 18px 18px 0 0 !important;
        }

        :global(.footer-shimmer) {
          border-radius: 20px 20px 0 0 !important;
        }

        .footer-container {
          position: relative;
          z-index: 1;
          width: 100%;
          margin: 0 auto;
          padding: 50px 20px 20px;
        }

        /* Logo Section */
        .footer-logo {
          text-align: center;
          margin-bottom: 40px;
        }

        .footer-logo-container {
          width: 120px;
          height: 45px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: transform 0.3s ease;
          cursor: pointer;
        }

        .footer-logo-container:hover {
          transform: scale(1.05);
        }

        .footer-logo-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* Social Media Icons */
        .links {
          --hover-height: 0.5rem;
          --link-size: 4rem;
          position: relative;
          display: grid;
          grid-auto-flow: column;
          align-items: end;
          justify-content: center;
          gap: 15px;
        }

        /* Sibling blur effect when ANY icon is hovered */
        .links:has(.link:hover) .link:not(:hover) {
          filter: grayscale(0.9) blur(0.1rem);
        }

        .link {
          text-decoration: none;
          color: inherit;
          display: block;
          position: relative;
          aspect-ratio: 1 / 1;
          width: var(--link-size);
          padding: 0;
          background-image: var(--icon);
          background-size: 100% auto;
          background-repeat: no-repeat;
          background-position: center;
          background-origin: content-box;
          will-change: transform, filter;
          transform: translateZ(0);
          backface-visibility: hidden;
          transition-property: transform, filter;
          transition-timing-function: ease-in-out, ease;
          transition-duration: 0.35s, 0.2s;
          transition-delay: 0s, 0.2s;
        }

        /* Reflection effect using ::after pseudo-element */
        .link::after {
          pointer-events: none;
          display: block;
          content: "";
          position: absolute;
          height: var(--link-size);
          inset: 0;
          top: 90%;
          transform: scaleY(-1);
          mask: linear-gradient(to bottom, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.2));
          mask-composite: exclude;
          -webkit-mask-composite: xor; /* Safari fallback */
          filter: blur(2px);
          padding: 0;
          background-image: var(--icon);
          background-size: 100% auto;
          background-repeat: no-repeat;
          background-position: center;
          background-origin: content-box;
          transition-property: transform;
          transition-timing-function: ease-in-out;
          transition-duration: 0.35s;
        }

        /* LinkedIn icon has special reflection positioning */
        .link[href*="linkedin"]::after {
          top: 95%;
        }

        /* Hover state - lift 0.5rem + scale 1.1x */
        .link:hover {
          transform: translateY(calc(-1 * var(--hover-height))) scale(1.1);
          filter: drop-shadow(0 0 0.25rem rgba(255, 255, 255, 0.25));
        }

        .link:hover::after {
          transform: scaleY(-1) translateY(calc(-2 * var(--hover-height))) scale(1.1);
        }

        /* Wave Animation - triggered by scroll */
        .link.wave-animate {
          animation: smoothWave 1.2s ease-in-out;
        }

        .link.wave-animate::after {
          animation: smoothWaveReflection 1.2s ease-in-out;
        }

        @keyframes smoothWave {
          0%, 100% {
            transform: translateY(0) scale(1);
            filter: drop-shadow(0 0 0.1rem rgba(255, 255, 255, 0.15));
          }
          50% {
            transform: translateY(calc(-1 * var(--hover-height))) scale(1.1);
            filter: drop-shadow(0 0 0.25rem rgba(255, 255, 255, 0.25));
          }
        }

        @keyframes smoothWaveReflection {
          0%, 100% {
            transform: scaleY(-1) translateY(0) scale(1);
          }
          50% {
            transform: scaleY(-1) translateY(calc(-2 * var(--hover-height))) scale(1.1);
          }
        }

        /* Footer Bottom */
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .footer-nav-links {
          display: flex;
          gap: 25px;
          flex-wrap: wrap;
        }

        .footer-nav-link {
          color: #cccccc;
          text-decoration: none;
          font-family: 'Synonym', sans-serif;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .footer-nav-link:hover {
          color: #ffd700;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
        }

        .footer-copyright {
          color: #cccccc;
          font-family: 'Synonym', sans-serif;
          font-size: 14px;
        }

        /* Rocket Icon */
        .footer-rocket {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 45px 0 20px;
        }

        .rocket-icon {
          width: 28px;
          height: 28px;
          fill: #ffd700;
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
          animation: rocketPulse 2s ease-in-out infinite;
        }

        @keyframes rocketPulse {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-3px) scale(1.05);
          }
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .footer-container {
            padding: 40px 15px 20px;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }

          .footer-nav-links {
            justify-content: center;
          }
        }

        @media (max-width: 500px) {
          .links {
            --link-size: 2.8rem;
          }
        }

        @media (max-width: 480px) {
          .footer-container {
            padding: 30px 15px 15px;
          }

          .footer-logo {
            margin-bottom: 30px;
          }

          .footer-nav-links {
            flex-direction: column;
            gap: 12px;
          }
        }

        @media (max-width: 400px) {
          .links {
            --link-size: 2.5rem;
          }
        }
      `}</style>
    </footer>
  );
}
