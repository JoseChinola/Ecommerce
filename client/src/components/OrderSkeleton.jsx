const OrderSkeleton = () => {
    return (
        <div className="animate-pulse bg-secundary rounded-lg px-2 py-4 shadow-md space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="overflow-x-auto bg-white p-2 rounded-lg">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center space-x-4 py-3 border-b last:border-none">
                        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderSkeleton;