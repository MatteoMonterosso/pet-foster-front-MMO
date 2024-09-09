import React, { useState, useEffect } from 'react';
import { Container, Section, Heading, Box, Button, Tabs } from 'react-bulma-components';
import { isValidPhoneNumber } from 'libphonenumber-js';
import LoginForm from '../formulaires/Login';
import { SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';


// Fonction pour récupérer les villes en fonction du pays et du terme de recherche
const fetchCities = async (country: string, searchTerm: string) => {
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country })
        });

        const data = await response.json();
        const allCities = data.data || [];

        // Créez des options simples avec une chaîne de caractères pour le label et la valeur
        const filteredCities = allCities.filter((city: string) =>
            city.toLowerCase().startsWith(searchTerm.toLowerCase())
        ).map((city: string) => ({
            label: city,
            value: city,
        }));

        return filteredCities;
    } catch (error) {
        console.error("Erreur lors de la récupération des villes:", error);
        return [];
    }
};

type CityOption = {
    value: string;
    label: string;
};

// Composant principal de la page d'inscription
const RegistrationPage = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [countries, setCountries] = useState<{ name: string, dialCode: string, isoCode: string }[]>([]);
    const [selectedCountry, setSelectedCountry] = useState(''); 
    const [selectedCity, setSelectedCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [postalCodeError, setPostalCodeError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [userType, setUserType] = useState('');
    const [countryDialCode, setCountryDialCode] = useState('');
    const [selectedCountryCode, setSelectedCountryCode] = useState('');
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');
    
    // Fonction loadCityOptions pour AsyncSelect
    const loadCityOptions = async (inputValue: string) => {
        if (inputValue.length > 0 && selectedCountry) {
            return await fetchCities(selectedCountry, inputValue);
        } else {
            return [];
        }
    };

    // Validation de l'email
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Fonction pour gérer le changement de numéro de téléphone et ajouter l'indicatif si nécessaire
    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let phone = e.target.value;

        // Ajouter l'indicatif du pays si manquant
        if (!phone.startsWith(countryDialCode)) {
            phone = countryDialCode + phone;
        }
        setPhoneNumber(phone);
    };

    // Soumission du formulaire (inscription)
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        let isValid = true;
    
        // Validation des champs
        if (!validateEmail(email)) {
            setEmailError("Veuillez entrer une adresse email valide.");
            isValid = false;
        } else {
            setEmailError('');
        }
    
        if (password !== confirmPassword) {
            setPasswordError("Les mots de passe ne correspondent pas.");
            isValid = false;
        } else if (password.length < 12) {
            setPasswordError("Le mot de passe doit contenir au moins 12 caractères.");
            isValid = false;
        } else {
            setPasswordError('');
        }
    
        if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
            setPhoneError("Veuillez entrer un numéro de téléphone valide.");
            isValid = false;
        } else {
            setPhoneError('');
        }
    
        if (!userType) {
            console.error("Veuillez sélectionner un type d'utilisateur.");
            isValid = false;
        }
    
        if (selectedCountryCode) {
            const isPostalCodeValid = await validatePostalCode(selectedCountryCode, selectedCity, postalCode);
            if (!isPostalCodeValid) {
                setPostalCodeError("Le code postal ne correspond pas à la ville sélectionnée.");
                isValid = false;
            } else {
                setPostalCodeError('');
            }
        } else {
            console.error("Code ISO du pays non défini.");
            isValid = false;
        }
    
        // Si toutes les validations sont passées
        if (isValid) {
            const newUser = {
                type_user: userType,
                name: name,
                email: email,
                password: password,
                country: selectedCountry,
                zip: postalCode,
                city: selectedCity,
                phone: phoneNumber,
                address: address,
            };
    
            try {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser),
                });
    
                const result = await response.json();
                if (response.ok) {
                    console.log("Utilisateur créé avec succès !");
                } else {
                    console.error("Erreur lors de la création de l'utilisateur :", result.error);
                }
            } catch (error) {
                console.error("Erreur lors de la requête :", error);
            }
        }
    };
    
    // Récupération de la liste des pays via l'API REST Countries
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all');
                const data = await response.json();

                const countryData = data.map((country: any) => ({
                    name: country.name.common,
                    dialCode: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
                    isoCode: country.cca2.toLowerCase()
                })).sort((a: any, b: any) => a.name.localeCompare(b.name));

                setCountries(countryData);
            } catch (error) {
                console.error("Erreur lors de la récupération des pays:", error);
            }
        };
        fetchCountries();
    }, []);

    // Validation du code postal via l'API Zippopotam.us
    const validatePostalCode = async (country: string, city: string, postalCode: string): Promise<boolean> => {
        try {
            const apiUrl = `https://api.zippopotam.us/${country.toLowerCase()}/${postalCode}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                console.error(`Erreur: Zippopotam.us renvoie le code d'état ${response.status}`);
                return false;
            }

            const data = await response.json();
            const matchingPlace = data.places.find((place: any) => 
                place['place name'].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
                city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            );

            return !!matchingPlace;
        } catch (error) {
            console.error("Erreur lors de la validation du code postal:", error);
            return false;
        }
    };

    return (
        <>
            <div>
                <Heading className="has-text-centered">Inscription</Heading>
            </div>

            <Section>
                <Container>
                    <Tabs align="center">
                        <Tabs.Tab active={activeTab === 'login'} onClick={() => setActiveTab('login')}>
                            Connexion
                        </Tabs.Tab>
                        <Tabs.Tab active={activeTab === 'signup'} onClick={() => setActiveTab('signup')}>
                            Créer un compte
                        </Tabs.Tab>
                    </Tabs>

                    <Box>
                        {activeTab === 'login' ? (
                            <LoginForm />
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {/* Type d'utilisateur */}
                                <div className="field">
                                    <label className="label">Type d'utilisateur <span className="has-text-danger">*</span> :</label>
                                    <div className="control">
                                        {['adoptant', 'famille', 'association'].map(type => (
                                            <label className="radio" key={type}>
                                                <input
                                                    type="radio"
                                                    name="userType"
                                                    value={type}
                                                    checked={userType === type}
                                                    onChange={(e) => setUserType(e.target.value)}
                                                />
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Nom */}
                                <div className="field">
                                    <label className="label" htmlFor="nom">Nom <span className="has-text-danger">*</span> :</label>
                                    <div className="control">
                                        <input 
                                            className="input" 
                                            type="text" 
                                            id="nom" 
                                            name="nom" 
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="field">
                                    <label className="label" htmlFor="email">Email <span className="has-text-danger">*</span> :</label>
                                    <div className="control">
                                        <input
                                            className={`input ${emailError ? 'is-danger' : ''}`}
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {emailError && <p className="help is-danger">{emailError}</p>}
                                </div>

                                {/* Mot de passe */}
                                <div className="field">
                                    <label className="label" htmlFor="password">Mot de passe <span className="has-text-danger">*</span> :</label>
                                    <div className="control">
                                        <input
                                            className={`input ${passwordError ? 'is-danger' : ''}`}
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {passwordError && <p className="help is-danger">{passwordError}</p>}
                                </div>

                                {/* Confirmer le mot de passe */}
                                <div className="field">
                                    <label className="label" htmlFor="confirm_password">Confirmer le mot de passe <span className="has-text-danger">*</span> :</label>
                                    <div className="control">
                                        <input
                                            className={`input ${passwordError ? 'is-danger' : ''}`}
                                            type="password"
                                            id="confirm_password"
                                            name="confirm_password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {passwordError && <p className="help is-danger">{passwordError}</p>}
                                </div>

                                {/* Pays */}
                                <div className="field">
                                    <label className="label" htmlFor="pays">Pays <span className="has-text-danger">*</span> :</label>
                                    <div className="control">
                                        <div className="select">
                                            <select
                                                id="pays"
                                                value={selectedCountry}
                                                onChange={(e) => setSelectedCountry(e.target.value)}
                                                required
                                            >
                                                <option value="">Sélectionnez un pays</option>
                                                {countries.map(country => (
                                                    <option key={country.name} value={country.name}>
                                                        {country.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Ville */}
                                <div className="field">
                                    <label className="label" htmlFor="ville">Ville <span className="has-text-danger">*</span> :</label>
                                    <div className="control">
                                        <AsyncSelect
                                            cacheOptions
                                            loadOptions={loadCityOptions}
                                            onChange={(option: SingleValue<CityOption>) => setSelectedCity(option?.value || '')}
                                            isDisabled={!selectedCountry}
                                            placeholder="Tapez pour rechercher une ville"
                                            noOptionsMessage={() => "Commencez à taper une ville"}
                                        />
                                    </div>
                                </div>

                                {/* Code postal */}
                                <div className="field">
                                    <label className="label" htmlFor="code_postal">Code postal <span className="has-text-danger">*</span> :</label>
                                    <div className="control">
                                        <input
                                            className={`input ${postalCodeError ? 'is-danger' : ''}`}
                                            type="text"
                                            id="code_postal"
                                            name="code_postal"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {postalCodeError && <p className="help is-danger">{postalCodeError}</p>}
                                </div>

                                {/* Adresse */}
                                <div className="field">
                                    <label className="label" htmlFor="adresse">Adresse :</label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            id="adresse"
                                            name="adresse"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Téléphone */}
                                <div className="field">
                                    <label className="label" htmlFor="telephone">Téléphone :</label>
                                    <div className="control">
                                        <input
                                            className={`input ${phoneError ? 'is-danger' : ''}`}
                                            type="tel"
                                            id="telephone"
                                            name="telephone"
                                            value={phoneNumber}
                                            onChange={handlePhoneNumberChange}
                                        />
                                    </div>
                                    {phoneError && <p className="help is-danger">{phoneError}</p>}
                                </div>

                                {/* Conditions générales */}
                                <div className="field">
                                    <div className="control">
                                        <label className="checkbox">
                                            <input type="checkbox" id="conditions" name="conditions" required />
                                            J'accepte les <a href="#">conditions générales <span className="has-text-danger">*</span></a>
                                        </label>
                                    </div>
                                </div>

                                {/* Soumettre */}
                                <div className="field">
                                    <div className="control">
                                        <Button color="primary" fullwidth>Créer un compte</Button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </Box>
                </Container>
            </Section>
        </>
    );
};

export default RegistrationPage;
