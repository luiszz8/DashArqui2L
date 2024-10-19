"use client"; // Asegúrate de agregar esto al principio del archivo

import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [],
  });

  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [],
  });

  const [co2LineData, setCo2LineData] = useState({
    labels: [],
    datasets: [],
  });

  const [lightAreaData, setLightAreaData] = useState({
    labels: [],
    datasets: [],
  });

  const [data, setData] = useState([]); // Para almacenar todos los datos sin filtrar
  const [filteredData, setFilteredData] = useState([]); // Para almacenar los datos filtrados
  const [startDate, setStartDate] = useState(''); // Estado para la fecha de inicio
  const [endDate, setEndDate] = useState(''); // Estado para la fecha de fin

  const fetchData = async () => {
    try {
      const response = await fetch('https://valid-perfectly-crayfish.ngrok-free.app/historial');
      const apiData = await response.json();
      setData(apiData);

      if (startDate && endDate) {
        applyFilter(apiData);
      } else {
        updateChartData(apiData);
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, [startDate, endDate]);

  const updateChartData = (filteredData) => {
    const labels = filteredData.map(item => item.fecha);
    const humedad = filteredData.map(item => item.humedad);
    const temperatura = filteredData.map(item => item.temperatura);
    const distancia = filteredData.map(item => item.distancia);
    const co2 = filteredData.map(item => item.co2);
    const luz = filteredData.map(item => item.luz);

    setBarData({
      labels,
      datasets: [
        {
          label: 'Humedad',
          data: humedad,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Temperatura',
          data: temperatura,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    });

    setLineData({
      labels,
      datasets: [
        {
          label: 'Distancia',
          data: distancia,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
        },
      ],
    });

    setCo2LineData({
      labels,
      datasets: [
        {
          label: 'CO2',
          data: co2,
          fill: false,
          borderColor: 'rgba(0, 0, 0, 0)',
          backgroundColor: 'rgba(153, 102, 255, 1)',
          pointBorderColor: 'rgba(153, 102, 255, 1)',
          pointBackgroundColor: 'rgba(153, 102, 255, 1)',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    });

    setLightAreaData({
      labels,
      datasets: [
        {
          label: 'Luz',
          data: luz,
          fill: true,
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          tension: 0.3,
        },
      ],
    });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    applyFilter(data);
  };

  const applyFilter = (dataToFilter) => {
    const filteredData = dataToFilter.filter((item) => {
      const itemDate = new Date(item.fecha.split(' ')[0].split('-').reverse().join('-'));
      const start = new Date(startDate);
      const end = new Date(endDate);

      return itemDate >= start && itemDate <= end;
    });

    setFilteredData(filteredData);
    updateChartData(filteredData);
  };

  return (
    <div>
      {/* Barra de navegación */}
      <nav style={{ backgroundColor: '#333', padding: '10px' }}>
        <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', margin: 0, padding: 0 }}>
          <li style={{ marginRight: '20px' }}>
            <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Historial</a>
          </li>
          <li style={{ marginRight: '20px' }}>
            <a href="/TiempoReal" style={{ color: 'white', textDecoration: 'none' }}>Tiempo Real</a>
          </li>
          <li>
            <a href="/Prediccion" style={{ color: 'white', textDecoration: 'none' }}>Predicción</a>
          </li>
        </ul>
      </nav>

      <div style={{ padding: '20px' }}>
        <h1>Dashboard de Sensores</h1>

        <div style={{ width: '80%', margin: '0 auto' }}>
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Lecturas de Temperatura y Humedad' },
              },
              scales: {
                x: {
                  grid: { color: '#e0e0e0' },
                  ticks: { display: false },
                },
                y: { grid: { color: '#e0e0e0' } },
              },
            }}
          />
        </div>

        <div style={{ width: '80%', margin: '0 auto', marginTop: '50px' }}>
          <Line
            data={lineData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Lecturas de Distancia' },
              },
              scales: {
                x: {
                  grid: { color: '#e0e0e0' },
                  ticks: { display: false },
                },
                y: { grid: { color: '#e0e0e0' } },
              },
            }}
          />
        </div>

        <div style={{ width: '80%', margin: '0 auto', marginTop: '50px' }}>
          <Line
            data={co2LineData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Lecturas de CO2' },
              },
              scales: {
                x: {
                  grid: { color: '#e0e0e0' },
                  ticks: { display: false },
                },
                y: { grid: { color: '#e0e0e0' } },
              },
            }}
          />
        </div>

        <div style={{ width: '80%', margin: '0 auto', marginTop: '50px' }}>
          <Line
            data={lightAreaData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Lecturas de Luz' },
              },
              scales: {
                x: {
                  grid: { color: '#e0e0e0' },
                  ticks: { display: false },
                },
                y: { grid: { color: '#e0e0e0' } },
              },
            }}
          />
        </div>

        <form onSubmit={handleFilter} style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <label>
            Fecha de inicio:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              style={{ color: 'black' }}
            />
          </label>
          <label style={{ marginLeft: '10px' }}>
            Fecha de fin:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              style={{ color: 'black' }}
            />
          </label>
          <button type="submit" style={{ marginLeft: '10px' }}>Filtrar</button>
        </form>

      </div>
    </div>
  );
};

export default Dashboard;
