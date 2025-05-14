import React, { useState } from 'react';
import {
  Typography, Paper, Box, Grid, Card, CardContent,
  FormControl, InputLabel, Select, MenuItem, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  CurrencyExchange as CurrencyIcon,
  ShoppingCart as CartIcon,
  People as PeopleIcon,
  Restaurant as FoodIcon
} from '@mui/icons-material';
import Chart from 'react-apexcharts';

const Statistic = () => {
  const [timeRange, setTimeRange] = useState('week');
  
  // Sample data for charts
  const revenueData = {
    week: {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      data: [300000, 400000, 450000, 500000, 490000, 600000, 700000]
    },
    month: {
      labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
      data: [1800000, 2100000, 1900000, 2400000]
    },
    year: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      data: [5000000, 4800000, 5200000, 5500000, 5800000, 6000000, 6500000, 6800000, 7000000, 7100000, 7300000, 7500000]
    }
  };
  
  const orderData = {
    week: {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      data: [10, 15, 12, 18, 20, 25, 22]
    },
    month: {
      labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
      data: [58, 65, 70, 82]
    },
    year: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      data: [180, 210, 230, 240, 260, 280, 300, 320, 340, 360, 380, 400]
    }
  };
  
  const customerData = {
    week: {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      data: [2, 3, 1, 4, 3, 5, 4]
    },
    month: {
      labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
      data: [8, 12, 10, 15]
    },
    year: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      data: [25, 30, 35, 38, 42, 45, 48, 52, 55, 58, 60, 65]
    }
  };
  
  const topProducts = [
    { id: 1, name: 'Mỳ ý', sales: 85, revenue: '2.550.000đ', growth: 12 },
    { id: 2, name: 'Burger', sales: 72, revenue: '1.800.000đ', growth: 8 },
    { id: 3, name: 'Bánh tráng trộn', sales: 68, revenue: '680.000đ', growth: 15 },
    { id: 4, name: 'Nước ngọt', sales: 65, revenue: '975.000đ', growth: 5 },
    { id: 5, name: 'Mỳ xào', sales: 60, revenue: '1.200.000đ', growth: -3 },
  ];
  
  const topCustomers = [
    { id: 1, name: 'Nguyễn Văn A', orders: 15, spent: '1.500.000đ' },
    { id: 2, name: 'Trần Thị B', orders: 10, spent: '1.200.000đ' },
    { id: 3, name: 'Lê Văn C', orders: 8, spent: '950.000đ' },
    { id: 4, name: 'Phạm Thị D', orders: 5, spent: '450.000đ' },
    { id: 5, name: 'Hoàng Văn E', orders: 3, spent: '320.000đ' },
  ];
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Calculate totals
  const currentRevenueData = revenueData[timeRange];
  const totalRevenue = currentRevenueData.data.reduce((acc, curr) => acc + curr, 0);
  const totalOrders = orderData[timeRange].data.reduce((acc, curr) => acc + curr, 0);
  const totalCustomers = customerData[timeRange].data.reduce((acc, curr) => acc + curr, 0);
  
  // Chart options
  const revenueChartOptions = {
    chart: {
      id: 'revenue-chart',
      toolbar: { show: false },
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    xaxis: { categories: currentRevenueData.labels },
    colors: ['#ff5a5f'],
    fill: { 
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: ['#ff9a9e'],
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100]
      }
    },
    stroke: { curve: 'smooth', width: 3 },
    markers: { size: 4 },
    tooltip: {
      y: {
        formatter: (value) => formatCurrency(value),
      }
    },
  };
  
  const orderChartOptions = {
    chart: {
      id: 'orders-chart',
      toolbar: { show: false },
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    xaxis: { categories: orderData[timeRange].labels },
    colors: ['#36a2eb'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.3,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100]
      }
    },
    dataLabels: { enabled: false },
  };
  
  const customerChartOptions = {
    chart: {
      id: 'customers-chart',
      toolbar: { show: false },
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    xaxis: { categories: customerData[timeRange].labels },
    colors: ['#4bc0c0'],
    plotOptions: {
      bar: { borderRadius: 5, columnWidth: '50%' }
    },
  };
  
  const productDistributionOptions = {
    chart: {
      id: 'product-distribution',
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    labels: topProducts.slice(0, 5).map(product => product.name),
    colors: ['#ff5a5f', '#36a2eb', '#4bc0c0', '#ffcd56', '#9966ff'],
    legend: {
      position: 'bottom'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 300 },
        legend: { position: 'bottom' }
      }
    }],
  };


  return (
    <div></div>
  );
}

export default Statistic;