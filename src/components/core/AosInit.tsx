'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { usePathname } from 'next/navigation';

function useDetectDevToolsOpen() {
	useEffect(() => {
		const handleResize = () => {
			const devToolsOpened =
				window.outerWidth - window.innerWidth > 200 ||
				window.outerHeight - window.innerHeight > 200;
			if (devToolsOpened) {
				console?.clear?.();
			}
		};
		window?.addEventListener?.('resize', handleResize);
		return () => window?.removeEventListener?.('resize', handleResize);
	}, []);
}

export default function AOSInit() {
	useDetectDevToolsOpen();
	const pathname = usePathname();

	useEffect(() => {
		console.clear();
	}, [pathname]);

	useEffect(() => {
		AOS.init({
			duration: 600,
			offset: 40,
			once: true,
			mirror: false,
		});
	}, []);

	return null;
}
