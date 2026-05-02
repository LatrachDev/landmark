"use client";

import { memo } from "react";
import { JSX } from "react/jsx-runtime";

const FooterOffre = memo(function FooterOffre(): JSX.Element {
	return (
		<div
			className="w-full py-6 px-4 sm:px-6 md:px-8 lg:px-12 bg-[#f1f1f1] text-right"
			style={{ fontFamily: "Jost" }}
		>
			<h1 className="text-[#010e26] text-sm">
				Copyright &copy; {2025} - {new Date().getFullYear()} all rights reserved
			</h1>
		</div>
	);
});

export default FooterOffre;
