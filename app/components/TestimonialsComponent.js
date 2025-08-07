'use client';

import React, { useEffect, useState } from 'react';
import { InfiniteMovingCards } from './ui/InfiniteMovingCards';

export function TestimonialsComponent() {
  return (
    <div className='h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden'>
      <InfiniteMovingCards
        items={testimonials1}
        direction='right'
        speed='slow'
      />
      {/* <InfiniteMovingCards
        items={testimonials2}
        direction='right'
        speed='slow'
      /> */}
    </div>
  );
}

export const testimonials1 = [
  {
    quote:
      'Kurang dari seminggu aktifin auto trade porto udah mulai hijau, proses cepat dan transparan bisa ketemuan langsung',
    name: 'Mustafa',
    title: 'Luar Biasa',
    avatar: 'https://i.ibb.co.com/kQBpZdB/mustafa.jpg',
  },
  {
    quote:
      'Bisa belajar coding pine script dari 0 sampai sekarang punya trading plan sendiri bahkan sudah bisa mengaktifkan auto trade sendiri untuk tradingnya sendiri',
    name: 'Alvin',
    title: 'Diajarin Bikin Trading Plan',
    avatar: 'https://i.ibb.co.com/dbFLJX1/alvin.jpg',
  },
  {
    quote:
      'Sudah ikut workshop algoritma untuk auto trading 2x, sekarang bisa aktifin auto trade di akun saya menggunakan trading plan hasil racikan saya sendiri',
    name: 'Carney',
    title: '6000 Persen Profit',
    avatar: 'https://i.ibb.co.com/KD1Mhtj/carney.jpg',
  },
  {
    quote:
      'Step by step belajar algotrading, trading jadi bisa diotomatiskan dan bisa TP kapan aja. Pasang sebelum halving, dalam 2 bulan bisa 90% profit dari modal',
    name: 'Hendra Agustian',
    title: '90% profit dalam 2 bulan',
    avatar: '',
  },
  {
    quote:
      'Metode algotrading bener2 bisa menghilangkan faktor emosi dalam trading, dan bikin trading jadi disiplin sesuai trading plan yang udah di-set di awal. Pilihan exchange juga banyak.',
    name: 'Ray',
    title: 'Trading tanpa pusing',
    avatar: '',
  },
];

const testimonials2 = [
  {
    quote:
      'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.',
    name: 'Charles Dickens',
    title: 'A Tale of Two Cities',
    avatar: '',
  },
  {
    quote:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
    name: 'William Shakespeare',
    title: 'Hamlet',
    avatar: '',
  },
  {
    quote: 'All that we see or seem is but a dream within a dream.',
    name: 'Edgar Allan Poe',
    title: 'A Dream Within a Dream',
    avatar: '',
  },
  {
    quote:
      'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    name: 'Jane Austen',
    title: 'Pride and Prejudice',
    avatar: '',
  },
  {
    quote:
      'Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.',
    name: 'Herman Melville',
    title: 'Moby-Dick',
    avatar: '',
  },
];
