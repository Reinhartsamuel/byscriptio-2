'use client';
import Turnstile, { useTurnstile } from 'react-turnstile';
import React from 'react';
// ...

export default function TurnstileWidget() {
  const turnstile = useTurnstile();
  return (
    <Turnstile
      sitekey='0x4AAAAAAAkWO8b1LGOAI0a-'
      onVerify={(token) => {
        // fetch('/login', {
        //   method: 'POST',
        //   body: JSON.stringify({ token }),
        // }).then((response) => {
        //   if (!response.ok) turnstile.reset();
        // });
        console.log(token, 'turnstile token');
        document.getElementById('login-screen').style.display = 'flex';
        turnstile.reset();
      }}
    />
  );
}
