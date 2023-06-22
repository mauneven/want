import cities from '../../data/cities.json';
import states from '../../data/states.json';
import countries from '../../data/countries.json';
import React, { useState, useEffect } from 'react';

const modifiedCountries = countries.countries.map((country) => {
  return {
    id: country.id,
    name: country.name,
    states: states.states
      .filter((state) => parseInt(state.country_id) === country.id)
      .map((state) => {
        return {
          id: state.id,
          name: state.name,
          cities: cities.cities
            .filter((city) => city.state_id === state.id)
            .map((city) => city.name),
        };
      }),
  };
});

const Location = ({ 
  onCountryChange, 
  onStateChange, 
  onCityChange, 
  isRequired = false, 
  initialCountry = "", 
  initialState = "", 
  initialCity = "" 
}) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);  

  useEffect(() => {
    const foundCountry = modifiedCountries.find(country => country.name === initialCountry);
    setSelectedCountry(foundCountry || null);
  }, [initialCountry]);

  useEffect(() => {
    const foundState = selectedCountry && selectedCountry.states.find(state => state.name === initialState);
    setSelectedState(foundState || null);
  }, [selectedCountry, initialState]);

  useEffect(() => {
    setSelectedCity(initialCity || null);
  }, [initialCity]);

  const handleCountryChange = (event) => {
    const countryId = parseInt(event.target.value);
    const foundCountry = modifiedCountries.find(country => country.id === countryId);
    setSelectedCountry(foundCountry);
    setSelectedState(null);
    setSelectedCity(null);
    onCountryChange && onCountryChange(foundCountry?.name);
  };

  const handleStateChange = (event) => {
    const stateId = event.target.value;
    const foundState = selectedCountry && selectedCountry.states.find(state => state.id === stateId);
    setSelectedState(foundState);
    setSelectedCity(null);
    onStateChange && onStateChange(foundState?.name !== 'Select an state' ? foundState?.name : null);
  };
  
  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    onCityChange && onCityChange(city !== 'Select a city' ? city : null);
  };

  return (
    <div className="d-flex flex-wrap align-items-center">
      <select id="country-select" className="form-select rounded-5" value={selectedCountry?.id} onChange={handleCountryChange} required={isRequired}>
        <option value="">Choose a country</option>
        {modifiedCountries.map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
          </option>
        ))}
      </select>

      {selectedCountry && (
        <React.Fragment>
          <select id="state-select" className="form-select mt-2 rounded-5" value={selectedState?.id} onChange={handleStateChange} required={isRequired}>
            <option value="">Choose an state</option>
            {selectedCountry.states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </React.Fragment>
      )}

      {selectedState && (
        <React.Fragment>
          <select id="city-select" className="form-select mt-2 rounded-5" value={selectedCity} onChange={handleCityChange} required={isRequired}>
            <option value="">Choose a city</option>
            {selectedState.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </React.Fragment>
      )}
    </div>
  );
};

export default Location;