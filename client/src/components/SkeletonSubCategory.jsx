import React from "react";

const SkeletonSubCategory = () => {
    return (
        <div className="w-full p-2 rounded lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b animate-pulse">
            <div className="w-fit max-w-28 mx-auto lg:mx-0 rounded box-border">
                <div className="w-14 lg:h-14 lg:w-12 h-14 bg-blue-100 rounded-md"></div>
            </div>
            <div className="mt-3 lg:mt-0 w-3/4 h-4 bg-blue-100 rounded-md"></div>
        </div>
    );
};

export default SkeletonSubCategory;
