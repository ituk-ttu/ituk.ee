import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/logos/ituk_navbar_logo.svg';
import Hamburger from './hamburger';
import Button from './button';

export default function Navbar() {
    return (
        <header className="navbar dark shadow-filled">
            <Image src={logo} alt="Logo" height={56}/>
            <div className="buttons">
                <Link href="/aboutus"><Button type='tertiary' text='Meist' /></Link>
                <Link href="/events"><Button type='tertiary' text='Üritused' /></Link>
                <Link href="/cooperation"><Button type='tertiary' text='Koostöö' /></Link>
                <Link href="/contact"><Button type='tertiary' text='Kontakt' /></Link>
                <Link href="/rent"><Button type='tertiary' text='Rent' /></Link>
                <Link href="/join"><Button type='tertiary' text='Liitu' /></Link>
            </div>
            <Hamburger />
        </header>
    );
};