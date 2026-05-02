export default function OffreLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{children}
			<style>{`
                body > footer,
                body > div > footer {
                    display: none !important;
                }
            `}</style>
		</>
	);
}
