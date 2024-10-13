import React, { createContext, useState, useContext } from 'react';

const BasketContext = createContext();

export const useBasket = () => {
    return useContext(BasketContext);
};

export const BasketProvider = ({ children }) => {
    const [basketItems, setBasketItems] = useState([]);

    const addToBasket = (item) => {
        const existingItem = basketItems.find(basketItem => basketItem.id === item.id);
        if (existingItem) {
            setBasketItems(basketItems.map(basketItem =>
                basketItem.id === item.id ? { ...basketItem, quantity: basketItem.quantity + 1 } : basketItem
            ));
        } else {
            setBasketItems([...basketItems, { ...item, quantity: 1 }]);
        }
    };

    const removeFromBasket = (id) => {
        setBasketItems(basketItems.filter(item => item.id !== id));
    };

    return (
        <BasketContext.Provider value={{ basketItems, addToBasket, removeFromBasket }}>
            {children}
        </BasketContext.Provider>
    );
};
