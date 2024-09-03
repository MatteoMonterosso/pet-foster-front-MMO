// problème sur les faux pays / temps de chargement long => pouvoir écrire / téléphone a vérifier / 

// API RestCountries : Cette API sert à récupérer la liste des pays. Elle fournit des informations sur tous les pays du monde, y compris leurs noms, codes, et autres détails.

// API CountriesNow : Cette API sert à récupérer les villes d'un pays spécifique. Lorsque vous sélectionnez un pays, l'API renvoie une liste des villes disponibles dans ce pays.



import React, { useState, useEffect } from 'react';
import { Container, Section, Heading, Box, Button, Tabs } from 'react-bulma-components';
import { isValidPhoneNumber } from 'libphonenumber-js';

const RegistrationPage: React.FC = () => {
    // États pour gérer les valeurs des champs de formulaire
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');
    const [countries, setCountries] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');

    // Validation de l'email
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Fonction pour gérer le changement de numéro de téléphone et ajouter l'indicatif si nécessaire
    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let phone = e.target.value;

        // Ajouter l'indicatif français si le pays sélectionné est la France
        if (selectedCountry === "France" && phone.startsWith("0")) {
            phone = "+33" + phone.substring(1);
        }
        
        setPhoneNumber(phone);
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = (event: React.FormEvent) => {
        let isValid = true;

        // Validation de l'email
        if (!validateEmail(email)) {
            setEmailError("Veuillez entrer une adresse email valide.");
            isValid = false;
        } else {
            setEmailError('');
        }

        // Vérification de la correspondance des mots de passe
        if (password !== confirmPassword) {
            setPasswordError("Les mots de passe ne correspondent pas.");
            isValid = false;
        } else {
            setPasswordError('');
        }

        // Validation du numéro de téléphone uniquement s'il est renseigné
        if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
            setPhoneError("Veuillez entrer un numéro de téléphone valide.");
            isValid = false;
        } else {
            setPhoneError('');
        }

        // Empêcher la soumission si les validations échouent
        if (!isValid) {
            event.preventDefault();
        }
    };

    // Récupération de la liste des pays via l'API REST Countries
    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const countryNames = data.map((country: any) => country.name.common).sort();
                setCountries(countryNames); // Mise à jour de la liste des pays
            })
            .catch(error => console.error("Erreur lors de la récupération des pays:", error));
    }, []);

    // Récupération des villes en fonction du pays sélectionné via l'API countriesnow.space
    useEffect(() => {
        if (selectedCountry) {
            fetch('https://countriesnow.space/api/v0.1/countries/cities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    country: selectedCountry
                })
            })
            .then(response => response.json())
            .then(data => {
                setCities(data.data || []); // Mise à jour de la liste des villes
            })
            .catch(error => console.error("Erreur lors de la récupération des villes:", error));
        } else {
            setCities([]);
        }
    }, [selectedCountry]);

    return (
        <Section>
            <Container>
                <Heading size={2} className="has-text-centered">Inscription</Heading>

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
                        // Formulaire de connexion
                        <form>
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

                            <div className="field">
                                <label className="label" htmlFor="password">Mot de passe :</label>
                                <div className="control">
                                    <input className="input" type="password" id="password" name="password" required />
                                </div>
                            </div>

                            <div className="field">
                                <div className="control">
                                    <Button color="primary" fullwidth>S'inscrire</Button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        // Formulaire de création de compte
                        <form action="/submit_registration" method="post" onSubmit={handleSubmit}>
                            <div className="field">
                                <label className="label" htmlFor="nom">Nom <span className="has-text-danger">*</span> :</label>
                                <div className="control">
                                    <input className="input" type="text" id="nom" name="nom" required />
                                </div>
                            </div>

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

                            <div className="field">
                                <label className="label" htmlFor="pays">Pays <span className="has-text-danger">*</span> :</label>
                                <div className="control">
                                    <div className="select">
                                        <select id="pays" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} required>
                                            <option value="">Sélectionnez un pays</option>
                                            {countries.map(country => (
                                                <option key={country} value={country}>{country}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label" htmlFor="ville">Ville <span className="has-text-danger">*</span>:</label>
                                <div className="control">
                                    <div className="select">
                                        <select
                                            id="ville"
                                            value={selectedCity}
                                            onChange={(e) => setSelectedCity(e.target.value)}
                                            disabled={!selectedCountry}
                                            required
                                        >
                                            <option value="">Sélectionnez une ville</option>
                                            {cities.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label" htmlFor="code_postal">Code postal <span className="has-text-danger">*</span> :</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        id="code_postal"
                                        name="code_postal"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label" htmlFor="adresse">Adresse <span className="has-text-danger">*</span> :</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        id="adresse"
                                        name="adresse"
                                        required
                                    />
                                </div>
                            </div>

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

                            <div className="field">
                                <div className="control">
                                    <label className="checkbox">
                                        <input type="checkbox" id="conditions" name="conditions" required />
                                        J'accepte les <a href="#">conditions générales <span className="has-text-danger">*</span></a>
                                    </label>
                                </div>
                            </div>

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
    );
};

export default RegistrationPage;
