import React from 'react';
import email from '@/assets/icons/email.svg';
import phone from '@/assets/icons/phone.svg';
import location from '@/assets/icons/location.svg';
import facebook from '@/assets/icons/facebook.svg';
import instagram from '@/assets/icons/instagram.svg';
import github from '@/assets/icons/github.svg';
import separator from '@/assets/icons/separator.svg';
import hub from '@/assets/logos/ituk_hub.svg'
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className='dark shadow-filled'>
            <div className='contacts'>
                <div className='footer-row'><Image src={email} alt="Email" width={30} height={24} /><p className='underline'>kontakt@ituk.ee</p></div>
                <div className='footer-row'><Image src={phone} alt="Phone" width={30} height={24} /><p className='underline'>+372 5693 1193</p></div>
                <div className='footer-row'><Image src={location} alt="Location" width={30} height={24} /><p className='underline'>ICO-210, Raja 4c, Tallinn, Harjumaa</p></div>
            </div>
            <div className='socials'>
                <div className='links'>
                    <Image className='facebook' src={facebook} alt="Facebook" width={40} height={40} />
                    <Image src={separator} alt="Separator" width={0} height={24} />
                    <Image className='instagram' src={instagram} alt="Instagram" width={40} height={40} />
                    <Image src={separator} alt="Separator" width={0} height={24} />
                    <Image className='github' src={github} alt="Github" width={40} height={40} />
                </div>
                <div className='links'>
                    <Image src={hub} alt="Hub" height={24} />
                    <Link href='/stylebook'><p className='underline'>Stiiliraamat</p></Link>
                </div>
                <div className='other'>
                    <p>© ITÜK 2016-2024</p>
                </div>
            </div>
        </footer>
    );
};