import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Disclosure, Menu, Transition} from '@headlessui/react';
import {Link, useLocation} from 'react-router-dom';
import classNames from 'classnames';
import {MenuIcon, UserIcon, XIcon} from '@heroicons/react/outline';
import {HiddenValueToggle} from './HiddenValue';
import {Button} from './Button';
import {useUser} from '../store/auth/auth';
import {User} from '../models/User';
import {Collapse} from './Collapse';

export type MenuItem = {
    name: string;
    to: string;
    title?: string;
}

export const Navbar = () => {
	const navbar = useRef<HTMLDivElement>(null);
	const [fixed, setFixed] = useState(false);
	const location = useLocation();
	const user = useUser();

	const menu = useMemo<Array<MenuItem>>(() => [
		{ name: 'Dashboard', to: '/dashboard', title: 'Dashboard' },
		{ name: 'Accounts', to: '/accounts', title: 'Accounts' },
	], []);

	const active = useMemo(() => menu.find((item) => item.to === location.pathname), [location]);

	const onScroll = () => {
		const position = document.body.scrollTop || document.documentElement.scrollTop;
		const target = navbar.current?.clientHeight || 0;
		setFixed(position > target);
	};

	useEffect(() => {
		window.addEventListener('scroll', onScroll);

		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	}, []);

	return (
		<>
			<Disclosure as="nav" className="bg-gray-800 z-10">
				{({ open }) => (
					<>
						<div className={classNames('bg-gray-800 text-white h-16 w-full transition-transform duration-300', fixed ? 'sm:fixed sm:top-0' : 'sm:absolute sm:-translate-y-full sm:top-16')}>
							<div ref={navbar} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
								<div className="flex items-stretch h-16">
									{/*region Desktop header*/}
									<div className="hidden md:flex flex-grow items-center">
										<div>
											<NavbarTitle />
										</div>
										<div className="ml-4 flex items-baseline space-x-4 flex-grow">
											{menu.map((item) => (
												<Link
													key={item.name}
													to={item.to}
													className={classNames(
														'px-3 py-2 rounded-md text-sm font-medium transition-colors',
														item.to === active?.to
															? 'bg-gray-900 text-white'
															: 'text-gray-300 hover:bg-gray-700 hover:text-white',
													)}
													aria-current={item.to === active?.to ? 'page' : undefined}
												>
													{item.name}
												</Link>
											))}
										</div>
										<div className="ml-4 flex items-center md:ml-6">
											<HiddenValueToggle
												className="text-gray-400 hover:text-white"
											/>

											{/* Profile dropdown */}
											<Menu as="div" className="ml-3 relative">
												<div className="flex items-center">
													<Menu.Button as={Button} color="transparent" square className="rounded-full flex items-center text-sm focus:outline-none hover:shadow hover:shadow-black">
														<span className="sr-only">Open user menu</span>
														<NavbarUserImage user={user}/>
													</Menu.Button>
												</div>
												<Transition
													as={React.Fragment}
													enter="transition ease-out duration-100"
													enterFrom="transform opacity-0 scale-95"
													enterTo="transform opacity-100 scale-100"
													leave="transition ease-in duration-75"
													leaveFrom="transform opacity-100 scale-100"
													leaveTo="transform opacity-0 scale-95"
												>
													<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
														<Menu.Item>
															{({ active }) => (
																<Link
																	to="/logout"
																	className={classNames(
																		active ? 'bg-gray-100' : '',
																		'block px-4 py-2 text-sm text-gray-700'
																	)}
																>
                                                                    Logout
																</Link>
															)}
														</Menu.Item>
													</Menu.Items>
												</Transition>
											</Menu>
										</div>
									</div>
									{/*endregion*/}

									{/*region Mobile header right*/}
									<div className="flex md:hidden flex-grow items-center -mr-2 ">
										<div className="flex-grow">
											<NavbarTitle />
										</div>
										<Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
											<span className="sr-only">Open main menu</span>
											{open ? (
												<XIcon className="block h-6 w-6" aria-hidden="true" />
											) : (
												<MenuIcon className="block h-6 w-6" aria-hidden="true" />
											)}
										</Disclosure.Button>
									</div>
									{/*endregion*/}
								</div>
							</div>
						</div>

						{/*region Mobile menu*/}
						<Collapse open={open} className="md:hidden">
							<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
								{menu.map((item) => (
									<Disclosure.Button
										key={item.name}
										as={Link}
										to={item.to}
										className={classNames(
											'block px-3 py-2 rounded-md text-base font-medium transition-colors',
											item.to == active?.to ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
										)}
										aria-current={item.to === active?.to ? 'page' : undefined}
									>
										{item.name}
									</Disclosure.Button>
								))}
							</div>
							<div className="pt-4 pb-3 border-t border-gray-700">
								<div className="flex items-center px-5">
									<div className="flex-shrink-0">
										<NavbarUserImage user={user} className="w-10 h-10" />
									</div>
									<div className="ml-3">
										<div className="text-base font-medium leading-none text-white">{user?.name}</div>
										<div className="text-sm font-medium leading-none text-gray-400">{user?.email}</div>
									</div>
								</div>
								<div className="mt-3 px-2 space-y-1">
									<Disclosure.Button
										as={Link}
										to="/logout"
										className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
									>
                                        Logout
									</Disclosure.Button>
								</div>
							</div>
						</Collapse>
						{/*endregion*/}
					</>
				)}
			</Disclosure>

			<header className="bg-white shadow sm:mt-16">
				{active?.title && (
					<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
						<h1 className="text-3xl font-bold text-gray-900">{active.title}</h1>
					</div>
				)}
			</header>
		</>
	);
};

type NavbarUserImageProps = React.HTMLAttributes<HTMLImageElement> & {
    user?: User;
}
const NavbarUserImage = ({user, className, ...props}: NavbarUserImageProps) => {
	if (!user?.image) return (
		<UserIcon className={classNames('text-white bg-gray-900/40 hover:bg-gray-700 rounded-full transition-colors p-2', className)} />
	);

	return (
		<img className={classNames('rounded-full', className)} src={user.image} alt="" {...props} />
	);
};

const NavbarTitle = () => {
	return (
		<span className="text-xl tracking-wider"><span className="font-semibold">Finance</span> manager</span>
	);
};
