import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/logos/ituk_navbar_logo.svg';
import Hamburger from './hamburger';

export default function Navbar() {
    return (
        <header className="navbar dark shadow-filled">
            <Image src={logo} alt="Logo" height={56}/>
            <div className="buttons">
                <Link className='button-tertiary' href="/aboutus"><h1 className='button-text'>Meist</h1></Link>
                <Link className='button-tertiary' href="/events"><h1 className='button-text'>Üritused</h1></Link>
                <Link className='button-tertiary' href="/cooperation"><h1 className='button-text'>Koostöö</h1></Link>
                <Link className='button-tertiary' href="/contact"><h1 className='button-text'>Kontakt</h1></Link>
                <Link className='button-tertiary' href="/rent"><h1 className='button-text'>Rent</h1></Link>
                <Link className='button-tertiary' href="/join"><h1 className='button-text'>Liitu</h1></Link>
            </div>
            <Hamburger />
        </header>
    );
};