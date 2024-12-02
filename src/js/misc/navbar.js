class NavBar extends HTMLElement {
    connectedCallback() {
        const link = document.createElement('link'); // creating a link element in the html.
        link.rel = 'stylesheet';                                           //This is used to link css file to html.
        link.href = '../CSS/navbar.css';
        document.head.appendChild(link);
        this.innerHTML =  ` 
            <nav>
                <ul id="navbar-left-column">
                    <a href="../../html/index.html">
                        <img id="navbar-logo" src="../../images/logo.png" alt="Logo">
                    </a>
                </ul>
                <ul id="navbar-right-column">
                    <ul class="anchor-container">
                        <li><a href="../../html/index.html">Home</a></li>
                        <li><a href="../../html/movies/all-movies.html">All Movies</a></li>
<!--                        <li><a href="../html/admin.html">Admin</a></li>-->
                        <li><a href="../../html/showings/all-showings.html">All Showings</a></li>
<!--                        <li><a href="../html/login.html">Login</a></li>-->
                    </ul>   
                </ul>
            </nav>
        `; // adding html navbar to custom element.
    }
}

customElements.define('nav-bar', NavBar);

/*2nd version*/
/*
class NavBar extends HTMLElement {
    connectedCallback() {
        const link = document.createElement('link'); // creating a link element in the html.
        link.rel = 'stylesheet';                                           //This is used to link css file to html.
        link.href = '../CSS/navbar.css';
        document.head.appendChild(link);
        this.innerHTML =  `
            <nav>
                <ul class="left-column">
                    <ul class="anchor-container">
                        <li><a href="../html/index.html">Home</a></li>
                        <li><a href="../html/all-movies.html">All movies</a></li>
                        <li><a href="../html/admin.html">Admin</a></li>
                        <li><a href="../html/showings.html">Showings</a></li>
                    </ul>
                </ul>
                <ul class="middle-column">
                    <a href="../html/index.html">
                        <img id="navbar-logo" src="../images/logo.png" alt="Logo">
                    </a>
                </ul>
                <ul class="right-column">
                    <li><a href="../html/login.html">Login</a></li>
                </ul>
            </nav>
        `; // adding html navbar to custom element.
    }
}

customElements.define('nav-bar', NavBar);


 */