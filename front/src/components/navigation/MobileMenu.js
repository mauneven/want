// components/navigation/MobileMenu.js
import { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import LocationModal from "../locations/LocationPosts";
import { useRouter } from "next/router";
import Image from "next/image";
import Notifications from "../notifications/Notifications";
import CategoriesModal from "../categories/CategoriesPosts";

export default function MobileMenu({
    onLocationFilterChange,
    onSearchTermChange,
    onCategoryFilterChange,
}) {
    const [user, setUser] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const [locationFilter, setLocationFilter] = useState(null);
    const [filterVersion, setFilterVersion] = useState(0);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCategoriesModal, setShowCategoriesModal] = useState(false);
    const searchInputRef = useRef(null);
    const closeMenu = () => {
        document.querySelector(".navbar-toggler").click();
    };

    const router = useRouter();

    const handleLogoClick = () => {
        setSearchTerm("");
        onSearchTermChange("");
        router.push("/");
    };

    const handleCloseCategories = () => setShowCategoriesModal(false);

    const handleCategorySelected = (mainCategory, subCategory) => {
        console.log("Selected Category: ", mainCategory);
        console.log("Selected Subcategory: ", subCategory);
        const selectedCategory = {
            mainCategory: mainCategory,
            subCategory: subCategory !== "" ? subCategory : null,
        };
        onCategoryFilterChange(selectedCategory);
        handleCloseCategories();
    };

    const handleCategoryCleared = () => {
        const clearedCategory = {
            mainCategory: "",
            subCategory: "",
        };
        onCategoryFilterChange(clearedCategory);
    };

    const handleLocationSelected = (country, state, city) => {
        let newLocationFilter = {
            country: country,
            state: state && state !== "Choose an state" ? state : null,
            city: city && city !== "Choose a city" ? city : null,
            timestamp: new Date().getTime(),
        };

        // Si el país ha cambiado o solo el país está seleccionado, limpiar el estado y la ciudad
        if (
            !locationFilter ||
            country !== locationFilter.country ||
            (country && !state && !city)
        ) {
            newLocationFilter.state = null;
            newLocationFilter.city = null;
        }

        // Almacenar los datos de la ubicación en el localStorage
        localStorage.setItem("locationFilter", JSON.stringify(newLocationFilter));

        setLocationFilter(newLocationFilter);
        onLocationFilterChange(newLocationFilter);
        setFilterVersion(filterVersion + 1);
        handleClose();
    };

    useEffect(() => {
        const locationFilterString = localStorage.getItem("locationFilter");
        if (locationFilterString) {
            const parsedLocationFilter = JSON.parse(locationFilterString);
            setLocationFilter(parsedLocationFilter);
            onLocationFilterChange(parsedLocationFilter);
        }
    }, []); // Elimina la dependencia de locationFilter

    useEffect(() => {
        if (locationFilter) {
            onLocationFilterChange(locationFilter);
        }
    }, [locationFilter]); // Deja solo la dependencia de locationFilter

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.search.value);
        onSearchTermChange(e.target.search.value);
        setSearchTerm(e.target.search.value);
    };

    const handleClose = () => setShowLocationModal(false);
    const handleShow = () => setShowLocationModal(true);

    useEffect(() => {
        const checkSession = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user || null);
                setIsLogged(true);
            } else if (response.status === 401) {
                setIsLogged(false);
            }
        };

        checkSession();
    }, [router.pathname]);

    useEffect(() => {
        const locationFilterString = localStorage.getItem("locationFilter");
        if (locationFilterString) {
            const parsedLocationFilter = JSON.parse(locationFilterString);
            setLocationFilter(parsedLocationFilter);
            onLocationFilterChange(parsedLocationFilter);
        }
    }, []);

    function getUserImageUrl() {
        if (user && user.photo) {
            return `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.photo}`;
        }
    }

    return (
        <Navbar className="mobile-navbar" expand="lg">
            <Nav className="d-flex justify-content-start align-items-center">
                <Navbar.Brand onClick={handleLogoClick} className="divhover">
                    <Image
                        className="want-logo"
                        src="/icons/want-logo.svg"
                        alt="Want"
                        width={90}
                        height={50}
                    />
                </Navbar.Brand>
            </Nav>
            {user ? <Notifications /> : null}
            <Nav className="d-flex justify-content-end align-items-center">
                <Navbar.Toggle
                    aria-controls="mobile-navbar-nav"
                    className="navbar-light"
                />
            </Nav>
            <Navbar.Collapse
                id="mobile-navbar-nav"
                className="justify-content-end"
            >
                <Nav>
                    {user ? (
                        <>
                            <div className="row">
                                <div className="col-auto">
                                    <img
                                        src={
                                            user.photo
                                                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.photo}`
                                                : "icons/person-circle.svg"
                                        }
                                        alt="Profile"
                                        style={{
                                            borderRadius: "50%",
                                            width: "30px",
                                            height: "30px",
                                        }}
                                        onClick={() => router.push("/editProfile")}
                                        className="d-flex"
                                    />
                                </div>
                                <div className="col-auto my-auto mx-2">
                                    <p>{user.firstName}</p>
                                </div>
                            </div>

                            <Nav.Link onClick={() => { router.push("/myPosts"); closeMenu(); }}>
                                Mis publicaciones
                            </Nav.Link>
                            <Nav.Link onClick={() => { router.push("/sentOffers"); closeMenu(); }}>
                                Ofertas enviadas
                            </Nav.Link>
                            <Nav.Link onClick={() => { router.push("/receivedOffers"); closeMenu(); }}>
                                Ofertas recibidas
                            </Nav.Link>
                            <Nav.Link onClick={() => { router.push("/editProfile"); closeMenu(); }}>
                                Mi perfil
                            </Nav.Link>
                            <Nav.Link onClick={() => { router.push("/logout"); closeMenu(); }}>
                                Cerrar sesión
                            </Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link onClick={() => { router.push("/login"); closeMenu(); }}>
                                Ingresar
                            </Nav.Link>

                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
            <Form
                className="d-flex w-100 search-bar border rounded-5"
                onSubmit={handleSearchSubmit}
            >
                <FormControl
                    type="search"
                    placeholder="La gente quiere..."
                    className="mr-2 form-control-sm p-1 px-3 search-bar-input border-top-0 border-bottom-0 border-start-0 border-end"
                    aria-label="Search"
                    name="search"
                />
                <Button type="submit" variant="ml-2 search-btn">
                    <i className="bi bi-search"></i>
                </Button>
            </Form>
            <LocationModal
                className=""
                show={showLocationModal}
                onHide={() => setShowLocationModal(false)}
                onLocationSelected={handleLocationSelected}
            />
            <CategoriesModal
                isShown={showCategoriesModal}
                onHide={() => setShowCategoriesModal(false)}
                onCategorySelected={handleCategorySelected}
                onCategoryCleared={handleCategoryCleared}
            />
        </Navbar>
    );
}
