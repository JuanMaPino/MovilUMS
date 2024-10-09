import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://unmundodesonrisas-8fbd22f1274f.herokuapp.com/ayudantes';

const AyudanteContext = createContext();

export const useAyudantes = () => useContext(AyudanteContext);

export const AyudanteProvider = ({ children }) => {
    const [ayudantes, setAyudantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAllAyudantes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            setAyudantes(response.data);
        } catch (error) {
            console.error('Error fetching ayudantes:', error);
            setError('Error al cargar los ayudantes');
        } finally {
            setLoading(false);
        }
    };

    const createAyudante = async (data) => {
        try {
            const response = await axios.post(API_URL, data);
            setAyudantes(prevAyudantes => [...prevAyudantes, response.data]);
            return response.data;
        } catch (error) {
            console.error('Error creating ayudante:', error);
            throw error;
        }
    };

    const updateAyudante = async (id, data) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, data);
            setAyudantes(prevAyudantes => 
                prevAyudantes.map(ayudante => ayudante._id === id ? response.data : ayudante)
            );
            return response.data;
        } catch (error) {
            console.error('Error updating ayudante:', error);
            throw error;
        }
    };

    const deleteAyudante = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setAyudantes(prevAyudantes => prevAyudantes.filter(ayudante => ayudante._id !== id));
        } catch (error) {
            console.error('Error deleting ayudante:', error);
            throw error;
        }
    };

    const disableAyudante = async (id) => {
        try {
            const response = await axios.patch(`${API_URL}/${id}/estado`, {});
            setAyudantes(prevAyudantes => 
                prevAyudantes.map(ayudante => ayudante._id === id ? response.data : ayudante)
            );
            return response.data;
        } catch (error) {
            console.error('Error disabling ayudante:', error);
            throw error;
        }
    };

    useEffect(() => {
        getAllAyudantes();
    }, []);

    return (
        <AyudanteContext.Provider
            value={{
                ayudantes,
                loading,
                error,
                getAllAyudantes,
                createAyudante,
                updateAyudante,
                deleteAyudante,
                disableAyudante,
            }}
        >
            {children}
        </AyudanteContext.Provider>
    );
};
