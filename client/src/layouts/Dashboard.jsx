import React, { useEffect, useState } from 'react';
import Timeline from '../components/Timeline';
import CountryDistribution from '../components/CountryDistribution';
import StatsCard from '../components/ConversionRate';
import SalesData from '../components/SalesData';
import AxiosToastError from '../utils/AxiosToastError';
import SummaryApi from '../cammon/SummaryApi';
import Axios from '../utils/Axios';
import TopProductsTable from '../components/VisitorGraph';


const Dashboard = () => {
    const [data, setData] = useState([]);

    const fetchDashboardData = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getDashboard
            })
            const { data: resData } = response
            if (resData.success) {
                setData(resData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])


    return (
        <div className="p-6 space-y-6 bg-white rounded-xl">
            <div className='bg-blue-50 py-2 px-4 rounded-lg flex justify-between items-center shadow-md'>
                <h1 className="text-3xl text-[#13bd24] font-extrabold">Dashboard
                </h1>
                <span className='font-extrabold hidden md:block italic text-3xl text-[#13bd24]'>
                    D’RAF SERVICES
                </span>
            </div>

            {/* StatsCard Section */}
            <div className="">
                <StatsCard data={data.stats} />
            </div>

            {/* VisitorGraph & Timeline Section */}
            <div className="grid grid-cols-1 md:grid-cols-[65%_35%] gap-4 mt-6">
                {/* Producto más vendido */}
                <div className="rounded-2xl">
                    <TopProductsTable data={data.topProducts} />
                </div>

                {/* Transacciones */}
                <div className="rounded-2xl px-4">
                    <Timeline data={data.timeline} />
                </div>
            </div>

            {/* Ventas Semanales Graph Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Ventas Semanales */}
                <div className="md:col-span-2 rounded-2xl">
                    <SalesData data={data.weeklySales} />
                </div>

                {/* Country Distribution */}
                <div className="md:col-span-1 rounded-2xl">
                    <CountryDistribution data={data.cityDistribution} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;