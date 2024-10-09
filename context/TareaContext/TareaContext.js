import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://unmundodesonrisas-8fbd22f1274f.herokuapp.com/tareas'; // Reemplaza con la URL de tu API

const TareaContext = createContext();

export const useTareas = () => useContext(TareaContext);

export const TareaProvider = ({ children }) => {
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTareas = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            setTareas(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tareas:', error);
            setError('Error al cargar las tareas');
            setLoading(false);
        }
    };

    const createTarea = async (data) => {
        try {
            const response = await axios.post(API_URL, data);
            setTareas(prevTareas => [...prevTareas, response.data]);
            return response.data;
        } catch (error) {
            console.error('Error creating tarea:', error);
            throw error;
        }
    };

    const updateTarea = async (id, data) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, data);
            setTareas(prevTareas => 
                prevTareas.map(tarea => tarea._id === id ? response.data : tarea)
            );
            return response.data;
        } catch (error) {
            console.error('Error updating tarea:', error);
            throw error;
        }
    };

    const deleteTarea = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setTareas(prevTareas => prevTareas.filter(tarea => tarea._id !== id));
        } catch (error) {
            console.error('Error deleting tarea:', error);
            throw error;
        }
    };

    const disableTarea = async (id) => {
        try {
            const response = await axios.patch(`${API_URL}/${id}/estado`, {});
            setTareas(prevTareas => 
                prevTareas.map(tarea => tarea._id === id ? response.data : tarea)
            );
            return response.data;
        } catch (error) {
            console.error('Error disabling tarea:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchTareas();
    }, []);

    return (
        <TareaContext.Provider
            value={{
                tareas,
                loading,
                error,
                fetchTareas,
                createTarea,
                updateTarea,
                deleteTarea,
                disableTarea
            }}
        >
            {children}
        </TareaContext.Provider>
    );
};
