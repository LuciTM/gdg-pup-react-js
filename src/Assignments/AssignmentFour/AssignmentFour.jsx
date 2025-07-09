import React, { useState, useEffect } from "react";
import "./AssignmentFour.css"; // Import CSS

// Step 1: Create AssignmentFour.jsx to manage fetching and displaying the address
function AssignmentFour() {
  // Step 4 & 5: State for loading and error handling
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [otherAddress, setOtherAddress] = useState("");
  const [displayAddress, setDisplayAddress] = useState("");
  const [loading, setLoading] = useState({ regions: false, provinces: false, cities: false, barangays: false });
  const [error, setError] = useState({ regions: null, provinces: null, cities: null, barangays: null });
  const [hasProvinces, setHasProvinces] = useState(true); // Track if the selected region has provinces
  const [zipError, setZipError] = useState("");

  // Step 2: useEffect to fetch regions when the component mounts
  useEffect(() => {
    const fetchRegions = async () => {
      setLoading((prev) => ({ ...prev, regions: true }));
      setError((prev) => ({ ...prev, regions: null }));
      try {
        // Step 3: Fetch address data from the API
        const response = await fetch("https://psgc.cloud/api/regions");
        if (!response.ok) throw new Error("Failed to fetch regions");
        const data = await response.json();
        if (Array.isArray(data)) {
          setRegions(data);
        } else {
          setError((prev) => ({ ...prev, regions: "Unexpected response format." }));
        }
      } catch (err) {
        setError((prev) => ({ ...prev, regions: "Error fetching regions." }));
      } finally {
        setLoading((prev) => ({ ...prev, regions: false }));
      }
    };
    fetchRegions();
  }, []);

  // Fetch provinces when region changes
  const handleRegionChange = (e) => {
    const regionCode = e.target.value;
    setSelectedRegion(regionCode);
    setSelectedProvince("");
    setSelectedCity("");
    setSelectedBarangay("");
    setProvinces([]);
    setCities([]);
    setBarangays([]);
    setError((prev) => ({ ...prev, provinces: null, cities: null }));
    if (regionCode) {
      setLoading((prev) => ({ ...prev, provinces: true, cities: false }));
      fetch(`https://psgc.cloud/api/regions/${regionCode}/provinces`)
        .then((response) => {
          if (!response.ok) throw new Error();
          return response.json();
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setProvinces(data || []);
            setHasProvinces(true);
            setLoading((prev) => ({ ...prev, provinces: false }));
          } else {
            // No provinces (e.g., NCR), fetch cities/municipalities directly
            setProvinces([]);
            setHasProvinces(false);
            setLoading((prev) => ({ ...prev, provinces: false, cities: true }));
            fetch(`https://psgc.cloud/api/regions/${regionCode}/cities-municipalities`)
              .then((response) => {
                if (!response.ok) throw new Error();
                return response.json();
              })
              .then((cityData) => setCities(cityData || []))
              .catch(() => setError((prev) => ({ ...prev, cities: "Error fetching cities." })))
              .finally(() => setLoading((prev) => ({ ...prev, cities: false })));
          }
        })
        .catch(() => setError((prev) => ({ ...prev, provinces: "Error fetching provinces." })))
        .finally(() => setLoading((prev) => ({ ...prev, provinces: false })));
    }
  };

  // Fetch cities when province changes
  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    setSelectedCity("");
    setSelectedBarangay("");
    setCities([]);
    setError((prev) => ({ ...prev, cities: null }));
    if (provinceCode) {
      setLoading((prev) => ({ ...prev, cities: true }));
      fetch(`https://psgc.cloud/api/provinces/${provinceCode}/cities-municipalities`)
        .then((response) => {
          if (!response.ok) throw new Error();
          return response.json();
        })
        .then((data) => setCities(data || []))
        .catch(() => setError((prev) => ({ ...prev, cities: "Error fetching cities." })))
        .finally(() => setLoading((prev) => ({ ...prev, cities: false })));
    }
  };

  // Fetch barangays when city changes
  const handleCityChange = (e) => {
    const cityCode = e.target.value;
    setSelectedCity(cityCode);
    setSelectedBarangay("");
    setError((prev) => ({ ...prev, barangays: null }));
    if (cityCode) {
      setLoading((prev) => ({ ...prev, barangays: true }));
      const cityObj = cities.find((city) => city.code === cityCode);
      console.log("Selected city object:", cityObj); // Debug log
      // Try /cities/{code}/barangays first, then fallback to /municipalities/{code}/barangays
      fetch(`https://psgc.cloud/api/cities/${cityCode}/barangays`)
        .then((response) => {
          if (!response.ok) throw new Error();
          return response.json();
        })
        .then((data) => setBarangays(data || []))
        .catch(() => {
          // Fallback to municipalities endpoint
          fetch(`https://psgc.cloud/api/municipalities/${cityCode}/barangays`)
            .then((response) => {
              if (!response.ok) throw new Error();
              return response.json();
            })
            .then((data) => setBarangays(data || []))
            .catch(() =>
              setError((prev) => ({
                ...prev,
                barangays: "Error fetching barangays.",
              }))
            )
            .finally(() =>
              setLoading((prev) => ({ ...prev, barangays: false }))
            );
        })
        .finally(() =>
          setLoading((prev) => ({ ...prev, barangays: false }))
        );
    }
  };

  // Step 6: Render the address dynamically once the data is successfully retrieved
  const handleConfirm = () => {
    // Validate ZIP code: must be exactly 4 digits
    if (!/^[0-9]{4}$/.test(zipCode)) {
      setZipError("ZIP code must be exactly 4 digits.");
      return;
    } else {
      setZipError("");
    }
    if (
      !selectedRegion ||
      (!selectedProvince && hasProvinces) ||
      !selectedCity ||
      !selectedBarangay ||
      !zipCode
    ) {
      alert("Please fill out all required fields.");
      return;
    }
    const regionName =
      regions.find((region) => region.code === selectedRegion)?.name ||
      "Unknown Region";
    const provinceName =
      provinces.find((province) => province.code === selectedProvince)?.name ||
      "Unknown Province";
    const cityName =
      cities.find((city) => city.code === selectedCity)?.name || "Unknown City";
    const barangayName =
      barangays.find((barangay) => barangay.code === selectedBarangay)?.name ||
      "Unknown Barangay";
    setDisplayAddress(
      `You live in   ${
        otherAddress || ""
      }, ${barangayName}, ${cityName}, ${provinceName}, ${regionName}, ${zipCode}, Philippines. \n      `
    );
  };

  // Step 7: Test the application to ensure conditional rendering works properly
  return (
    <div className="address-container">
      <div className="address-wrapper">
        <div className="title-container">
          <h1>My Address</h1>
          <p>
            {" "}
            Explore conditional rendering by fetching address details from an
            external API. The data is displayed only when successfully
            retrieved, showcasing how to handle loading states, API errors, and
            dynamic UI updates effectively.
          </p>
        </div>
        {displayAddress && (
          <div className="address-display">{displayAddress}</div>
        )}
        <div className="form-group">
          <label htmlFor="region">Region</label>
          {loading.regions ? (
            <p className="loading">Loading regions...</p>
          ) : error.regions ? (
            <p className="loading" style={{ color: "#d32f2f" }}>{error.regions}</p>
          ) : (
            <select
              id="region"
              value={selectedRegion}
              onChange={handleRegionChange}
            >
              <option value="" disabled>Select Region</option>
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
          )}
        </div>
        {/* Province field: only show if region has provinces */}
        {hasProvinces && (
        <div className="form-group">
          <label htmlFor="province">Province</label>
          {loading.provinces ? (
            <p className="loading">Loading provinces...</p>
          ) : error.provinces ? (
            <p className="loading" style={{ color: "#d32f2f" }}>{error.provinces}</p>
          ) : (
            <select
              id="province"
              value={selectedProvince}
              onChange={handleProvinceChange}
            >
              <option value="" disabled>Select Province</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
          )}
        </div>
        )}
        <div className="form-group">
          <label htmlFor="city">Municipality/City</label>
          {loading.cities ? (
            <p className="loading">Loading municipalities/cities...</p>
          ) : error.cities ? (
            <p className="loading" style={{ color: "#d32f2f" }}>{error.cities}</p>
          ) : (
            <select id="city" value={selectedCity} onChange={handleCityChange}>
              <option value="" disabled>Select Municipality/City</option>
              {cities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="barangay">Barangay</label>
          {loading.barangays ? (
            <p className="loading">Loading barangays...</p>
          ) : error.barangays ? (
            <p className="loading" style={{ color: "#d32f2f" }}>{error.barangays}</p>
          ) : (
            <select
              id="barangay"
              value={selectedBarangay}
              onChange={(e) => setSelectedBarangay(e.target.value)}
            >
              <option value="" disabled>Select Barangay</option>
              {barangays.map((barangay) => (
                <option key={barangay.code} value={barangay.code}>
                  {barangay.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="zipCode">ZIP Code</label>
          <input
            id="zipCode"
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            maxLength={4}
            className={zipError ? "input-error" : ""}
          />
          {zipError && <p className="loading" style={{ color: "#d32f2f" }}>{zipError}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="otherAddress">Other Address (Optional)</label>
          <input
            id="otherAddress"
            type="text"
            value={otherAddress}
            onChange={(e) => setOtherAddress(e.target.value)}
          />
        </div>
        <button onClick={handleConfirm}>Confirm</button>
      </div>
    </div>
  );
}

export default AssignmentFour;
