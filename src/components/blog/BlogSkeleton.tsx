'use client';

import React from 'react';

const CardSkeleton = () => (
    <div className="flex flex-col bg-white h-full p-3 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
        <div className="w-full h-44 bg-gray-200 rounded-xl mb-3"></div>
        <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
            <div className="space-y-1.5">
                <div className="h-3.5 bg-gray-200 rounded-md"></div>
                <div className="h-3.5 bg-gray-200 rounded-md w-5/6"></div>
            </div>
            <div className="h-3.5 bg-gray-200 rounded-md w-1/4 pt-1"></div>
        </div>
    </div>
);

export const BlogSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
};

export const BlogDetailsSkeleton = () => (
    <div className="mx-auto w-[90%] px-4 sm:px-6 mt-8 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="w-full h-56 md:h-80 bg-gray-200 rounded-2xl mb-8"></div>
        <div className="h-10 bg-gray-200 rounded w-3/4 mb-8"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
    </div>
);
