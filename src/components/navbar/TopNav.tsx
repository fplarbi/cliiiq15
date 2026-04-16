
import { Navbar, NavbarBrand, NavbarContent } from '@heroui/navbar'
import { Button } from '@heroui/button'
import Link from 'next/link'
import React from 'react'
import { GiMatchTip } from 'react-icons/gi'
import NavLink from './NavLink'
import { auth } from '@/auth'
import UserMenu from './userMenu'
import FiltersWrapper from './FiltersWrapper'

export default async function TopNav() {
    const session = await auth();

    const memberLinks = [
        { href: '/members', label: 'Matches' },
        { href: '/lists', label: 'Lists' },
        { href: '/messages', label: 'Messages' }
    ]

    const adminLinks = [
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/admin/moderation', label: 'Moderation' },
        { href: '/admin/users', label: 'Users' },
        { href: '/admin/settings', label: 'Settings' }
    ]

    const Links = session?.user.role === 'ADMIN' ? adminLinks : memberLinks;

    return (
        <>
            <Navbar
                maxWidth='xl'
                className='bg-linear-to-r from-purple-400 to-purple-700'
                classNames={{
                    item: [
                        'text-xl',
                        'text-white',
                        'uppercase',
                        'data-[active=true]:text-yellow-200'
                    ]
                }}
            >

                <NavbarBrand as={Link} href='/'>
                    <GiMatchTip size={40} />
                    <div className='font-bold text-3xl flex'>
                        <span className='text-gray-900'>CliiiQ</span>
                        <span className='text-gray-200'>HuB</span>
                    </div>
                </NavbarBrand>
                <NavbarContent justify='center'>
                    {Links.map(item => (
                        <NavLink key={item.href} href={item.href} label={item.label} />
                    ))}
                </NavbarContent>
                <NavbarContent justify='end'>
                    {session?.user ? (
                        <UserMenu user={session.user} />
                    ) : (
                        <>
                            <Button as={Link} href='/login' variant='bordered' className='text-white border-white'>Login</Button>
                            <Button as={Link} href='/register' variant='bordered' className='text-white border-white'>Register</Button>
                        </>
                    )}
                </NavbarContent>
            </Navbar>
            <FiltersWrapper />
        </>

    )
}
