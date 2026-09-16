// Created by https://urvanov.ru
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const token: unknown = process.env.APP_TOKEN;
    if (!token || typeof token !== 'string' || !token.trim()) {
      console.error('Application token is missing or invalid in environment variables.');
      return;
    }
    
  });
})();