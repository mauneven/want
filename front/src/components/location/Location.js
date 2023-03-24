import { useState } from 'react';

const countries = [
    {
        id: 1,
        name: 'Estados Unidos',
        states: [
            { id: 1, name: 'California', cities: ['Los Ángeles', 'San Francisco'] },
            { id: 2, name: 'Florida', cities: ['Miami', 'Orlando'] },
            { id: 3, name: 'Texas', cities: ['Houston', 'Dallas'] },
        ],
    },
    {
        id: 2,
        name: 'Colombia',
        states: [
            { id: 4, name: 'Antioquia', cities: ['Medellín', 'Envigado'] },
            { id: 5, name: 'Cundinamarca', cities: ['Bogotá', 'Chía'] },
            { id: 6, name: 'Valle del Cauca', cities: ['Cali', 'Palmira'] },
        ],
    },
    {
        id: 3,
        name: 'Singapur',
        states: [
            { id: 7, name: 'Central', cities: ['Singapur', 'Toa Payoh'] },
            { id: 8, name: 'Este', cities: ['Tampines', 'Pasir Ris'] },
            { id: 9, name: 'Norte', cities: ['Woodlands', 'Yishun'] },
        ],
    },
];

const Location = ({ onCountryChange, onStateChange, onCityChange }) => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    const handleCountryChange = (event) => {
        const countryId = parseInt(event.target.value);
        const country = countries.find((country) => country.id === countryId);
        setSelectedCountry(country);
        setSelectedState(null);
        setSelectedCity(null);
        onCountryChange && onCountryChange(country?.name);
    };    

    const handleStateChange = (event) => {
        const stateId = parseInt(event.target.value);
        const state = selectedCountry.states.find((state) => state.id === stateId);
        setSelectedState(state);
        setSelectedCity(null);
        onStateChange && onStateChange(state?.name);
    };    

    const handleCityChange = (event) => {
        const city = event.target.value;
        setSelectedCity(city);
        onCityChange && onCityChange(city); // Aquí se cambió 'selectedCity' por 'city'
    };
    

    return (
        <div className="d-flex flex-wrap align-items-center">
            <label htmlFor="country-select" className="me-2 mb-0">País:</label>
            <select id="country-select" className="form-select me-4" value={selectedCountry?.id} onChange={handleCountryChange}>
                <option value="">Seleccione un país</option>
                {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                        {country.name}
                    </option>
                ))}
            </select>

            {selectedCountry && (
                <>
                    <label htmlFor="state-select" className="me-2 mb-0">Estado:</label>
                    <select id="state-select" className="form-select me-4" value={selectedState?.id} onChange={handleStateChange}>
                        <option value="">Seleccione un estado</option>
                        {selectedCountry.states.map((state) => (
                            <option key={state.id} value={state.id}>
                                {state.name}
                            </option>
                        ))}
                    </select>
                </>
            )}

            {selectedState && (
                <>
                    <label htmlFor="city-select" className="me-2 mb-0">Ciudad:</label>
                    <select id="city-select" className="form-select" value={selectedCity} onChange={handleCityChange}>
                        <option value="">Seleccione una ciudad</option>
                        {selectedState.cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </>
            )}
        </div>
    );
};

export default Location;

