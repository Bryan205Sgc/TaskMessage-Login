import React from "react";

const Header = ({ user, onLogout }) => {
    return (
        <header>
            <h1>Bienvenido</h1>
            {user && (
                <div>
                    <span>Hola, {user.email}!</span>
                    <button onClick={onLogout}>Cerrar Sesión</button>
                </div>
            )}
        </header>
    );
};

export default Header;
