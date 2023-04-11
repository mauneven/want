import cities from '../../data/cities.json';
import states from '../../data/states.json';
import countries from '../../data/countries.json';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

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

const Location = ({ onCountryChange, onStateChange, onCityChange, onLocationSelected, isRequired = false }) => {

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");  

  useEffect(() => {
    handleLocationSelected();
  }, [selectedCity]);

  const clearLocation = () => {
    setSelectedState("");
    setSelectedCity("");
    onLocationSelected && onLocationSelected(selectedCountry?.name, "", "");
  };

  const resetCity = () => {
    setSelectedCity("");
    onCityChange && onCityChange(null);
    handleLocationSelected();
  };

  const handleCountryChange = (event) => {
    const countryId = parseInt(event.target.value);
    const foundCountry = modifiedCountries.find((country) => country.id === countryId);
    setSelectedCountry(foundCountry);
    clearLocation();
    console.log("Selected Country:", foundCountry);
    onCountryChange && onCountryChange(foundCountry?.name);
    clearLocation();
  };  

  const handleStateChange = (event) => {
    const stateId = event.target.value;
    const foundState = selectedCountry.states.find((state) => state.id === stateId);
    setSelectedState(foundState);
    console.log("Selected State:", foundState);
    onStateChange && onStateChange(foundState?.name !== 'Seleccione un estado' ? foundState?.name : null);
    resetCity();
  };
  
  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    console.log("Selected City:", city);
    onCityChange && onCityChange(city !== 'Seleccione una ciudad' ? city : null);
    handleLocationSelected();
  };  

  const handleLocationSelected = () => {
    if (selectedCountry && !selectedState && !selectedCity) {
      onLocationSelected && onLocationSelected(selectedCountry.name, null, null);
    } else if (selectedCountry && selectedState && !selectedCity) {
      onLocationSelected && onLocationSelected(selectedCountry.name, selectedState.name, null);
    } else if (selectedCountry && selectedState && selectedCity) {
      onLocationSelected && onLocationSelected(selectedCountry.name, selectedState.name, selectedCity);
    }
  };  

  return (
    <div className="d-flex flex-wrap align-items-center">
      <label htmlFor="country-select" className="me-2 mb-0">
        País:
      </label>
      <select id="country-select" className="form-select me-4" value={selectedCountry?.id} onChange={handleCountryChange} required={isRequired}>
        <option value="">Elije el país</option>
        {modifiedCountries.map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
          </option>
        ))}
      </select>

      {selectedCountry && (
        <React.Fragment>
          <label htmlFor="state-select" className="me-2 mb-0">
            Estado:
          </label>
          <select id="state-select" className="form-select me-4" value={selectedState?.id} onChange={handleStateChange} required={isRequired}>
            <option value="">Elije un estado</option>
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
          <label htmlFor="city-select" className="me-2 mb-0">
            Ciudad:
          </label>
          <select id="city-select" className="form-select" value={selectedCity} onChange={handleCityChange} required={isRequired}>
            <option value="">Elije una ciudad</option>
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

}

export default Location;