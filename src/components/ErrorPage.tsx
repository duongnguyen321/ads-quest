import { useSearchParams } from 'next/navigation';

function ErrorPage({ title }: { title: string }) {
	const searchParams = useSearchParams();
	const msg =
		title || searchParams.get('msg')?.toString() || 'An error occurred';
	return (
		<div
			className={
				'text-2xl sm:text-4xl bg-black text-white flex items-center justify-center text-center w-screen h-screen'
			}
		>
			{msg}
		</div>
	);
}

export default ErrorPage;
