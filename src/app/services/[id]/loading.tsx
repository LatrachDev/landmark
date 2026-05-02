import Footer from "@/components/footer/Footer";

export default function Loading() {
	return (
		<div className="font-['Jost'] bg-[#f9fafb] min-h-screen">
			<main className="mx-auto w-[90%] px-4 sm:px-6 mt-10">
				{/* Breadcrumb Skeleton */}
				<div className="mb-5">
					<div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
				</div>

				{/* Image Skeleton */}
				<div className="rounded-2xl mb-12 shadow-lg w-full md:h-125 h-75 bg-gray-200 animate-pulse flex items-center justify-center">
					<div className="text-gray-300">
						<svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</div>

				{/* Title Skeleton */}
				<div className="my-10 space-y-3">
					<div className="h-12 bg-gray-200 rounded w-3/4 animate-pulse"></div>
					<div className="h-12 bg-gray-200 rounded w-1/2 animate-pulse"></div>
				</div>

				{/* Content Skeleton */}
				<div className="space-y-4 max-w-4xl pb-20">
					<div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
					<div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
					<div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
					<div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
					<div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>

					<div className="pt-6">
						<div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse mb-3"></div>
						<div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
						<div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
